import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import ENV from '../config/environment';
import { router } from 'expo-router';

interface ApiError extends Error {
  code?: string;
  status?: number;
  data?: any;
}

// Ensure the API URLs don't have trailing slashes to prevent path duplication
const API_BASE_URL = ENV.API_URL.endsWith('/') ? ENV.API_URL.slice(0, -1) : ENV.API_URL;
const REMOTE_API_BASE_URL = ENV.REMOTE_API_URL.endsWith('/') ? ENV.REMOTE_API_URL.slice(0, -1) : ENV.REMOTE_API_URL;

// console.log('🔄 Initializing API with base URLs:', {
//   local: API_BASE_URL,
//   remote: REMOTE_API_BASE_URL
// });

// Common Axios config
const commonConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: ENV.API_TIMEOUT,
  withCredentials: false,
  validateStatus: (status) => status >= 200 && status < 500,
  maxRedirects: 0,
  ...(Platform.OS === 'ios' && {
    proxy: false,
    insecureHTTPParser: true
  })
};

// Create local API instance
const localApi = axios.create({
  ...commonConfig,
  baseURL: API_BASE_URL,
});

// Create remote API instance
const remoteApi = axios.create({
  ...commonConfig,
  baseURL: REMOTE_API_BASE_URL,
});

// Token refresh flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers about new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Refresh access token using refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });

    const { access_token, refresh_token } = response.data;
    
    // Store new tokens
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Backend availability state and cooldown
let isBackendAvailable = true;
let backendCheckPromise: Promise<any> | null = null;
let lastBackendCheckTime = 0;
const BACKEND_CHECK_COOLDOWN = 60 * 1000; // 1 minute cooldown

// Add interceptors to both API instances
const addInterceptors = (apiInstance: AxiosInstance, isRemote: boolean = false) => {
  apiInstance.interceptors.request.use(
    async (config) => {
      // Always get the latest token from AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      // Extra debug: log type and value
      console.log('🔑 [API] Token for', config.url, ':', token, '| typeof:', typeof token);
      if (token && token !== 'null' && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Remove Authorization header if no valid token
        if (config.headers && config.headers.Authorization) {
          delete config.headers.Authorization;
        }
      }
      // Log Authorization header before sending
      console.log('➡️ [API] Authorization header for', config.url, ':', config.headers.Authorization);
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      console.error('❌ [API Request Error]', error);
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as any; // allow custom props
      // Handle token expiration
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve) => {
              subscribeTokenRefresh((token: string) => {
                resolve(token);
              });
            });
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          } catch (err) {
            console.error('Failed to retry with new token:', err);
          }
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            onTokenRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        } finally {
          isRefreshing = false;
        }
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER_EMAIL
        ]);
        router.replace('/auth');
        return Promise.reject(error);
      }
      // Create a custom error with additional properties
      const apiError: ApiError = new Error(error.message);
      apiError.code = error.code;
      apiError.status = error.response?.status;
      apiError.data = error.response?.data;
      return Promise.reject(apiError);
    }
  );
};

// Add interceptors to both API instances
addInterceptors(localApi);
addInterceptors(remoteApi);

// If testBackendConnection is missing, add a stub to avoid errors
if (typeof testBackendConnection === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var testBackendConnection = async () => true;
}

// Smart API function that routes requests to the appropriate backend
const api = {
  async healthCheck(): Promise<boolean> {
    try {
      // console.log('🩺 Performing health check...');
      const response = await localApi.get('/api/v1/test', { timeout: 5000 });
      const isHealthy = response.status === 200 && response.data?.status === 'success';
      // console.log(`🏥 Health check result: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`, response.data);
      return isHealthy;
    } catch (error: any) {
      console.error('❌ Health check failed:', error.message || error);
      return false;
    }
  },
  
  async request(config: AxiosRequestConfig): Promise<any> {
    try {
      // Determine which API instance to use based on the URL
      const apiInstance = config.url?.startsWith('/api/v1/ai/') ? remoteApi : localApi;
      // console.log(`🌐 Making ${config.method?.toUpperCase() || 'REQUEST'} to ${config.url} using ${apiInstance === localApi ? 'LOCAL' : 'REMOTE'} API`);

      // Check if backend is available before making the request
      const now = Date.now();
      if (!isBackendAvailable) {
        // Only check again if cooldown has passed
        if (!backendCheckPromise && now - lastBackendCheckTime > BACKEND_CHECK_COOLDOWN) {
          backendCheckPromise = testBackendConnection();
          lastBackendCheckTime = now;
        }
        if (backendCheckPromise) {
          const isAvailable = await backendCheckPromise.catch(() => false);
          isBackendAvailable = isAvailable.success;
          backendCheckPromise = null;
          if (!isAvailable.success) {
            console.warn('⚠️ Backend is not available');
            return {
              status: 503,
              data: { message: 'Backend is not available' },
              headers: {},
              statusText: 'Service Unavailable',
              config: config,
            };
          }
        }
      }
      
      // Try to make the request
      const response = await apiInstance.request(config);
      
      // Check if we got a 404 response from the backend
      if (response.status === 404 && response.data?.code === 404) {
        console.warn(`⚠️ Backend endpoint not found: ${config.url}`);
      }
      
      return response;
    } catch (error) {
      // Check if this is a network error (backend down)
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        console.warn(`⚠️ Backend connection failed for ${config.url}`);
      }
      
      console.error(`❌ Error with ${config.url}:`, error.message || error);
      throw error;
    }
  },
  
  // Standard HTTP methods
  async get(url: string, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'get', url });
  },
  
  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'post', url, data });
  },
  
  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'put', url, data });
  },
  
  async delete(url: string, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'delete', url });
  },
  
  async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request({ ...config, method: 'patch', url, data });
  },
};

// Ensure compatibility: add .post, .get, .put, .delete, .patch as direct methods for legacy usage
api.post = api.post.bind(api);
api.get = api.get.bind(api);
api.put = api.put.bind(api);
api.delete = api.delete.bind(api);
api.patch = api.patch.bind(api);

// Export the api object as default (must be at the very end of the file)
export default api;

// Fix error logging for unknown type
function safeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return JSON.stringify(error);
}

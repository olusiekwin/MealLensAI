// Environment configuration
const ENV = {
    development: {
        API_URL: 'http://192.168.3.205:8001/v1', // Remove /api from URL to match backend routes
    },
    production: {
        API_URL: 'https://meallensai-backend.onrender.com/v1',
    }
};

// Set the current environment
const currentEnv = __DEV__ ? 'development' : 'production';

// Export the configuration for the current environment
export default ENV[currentEnv];

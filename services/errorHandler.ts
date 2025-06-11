/**
 * Global error handler for the MealLensAI app
 * This service helps catch and report errors that might cause white screens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Constants
const ERROR_LOG_KEY = 'meallensai_error_log';
const MAX_STORED_ERRORS = 10;

// Types
interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  additionalInfo?: any;
}

/**
 * Initialize the global error handler
 * This should be called as early as possible in the app lifecycle
 */
export const initializeErrorHandler = () => {
  if (typeof global !== 'undefined') {
    // Save the original error handler
    const originalErrorHandler = global.ErrorUtils.getGlobalHandler();

    // Create a new error handler
    global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      // Log the error
      logError(error, { isFatal });
      
      // Call the original error handler
      originalErrorHandler(error, isFatal);
    });

    console.log('✅ Global error handler initialized');
  }

  // For web platform
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), { 
        reason: event.reason 
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      logError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    console.log('✅ Web error handlers initialized');
  }
};

/**
 * Log an error to AsyncStorage and console
 */
export const logError = async (error: Error, additionalInfo?: any) => {
  try {
    // Create error log entry
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      additionalInfo
    };

    // Log to console
    console.error('❌ [ERROR]', errorLog);

    // Get existing logs
    const existingLogsJson = await AsyncStorage.getItem(ERROR_LOG_KEY);
    let logs: ErrorLog[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];

    // Add new log and keep only the most recent ones
    logs.unshift(errorLog);
    logs = logs.slice(0, MAX_STORED_ERRORS);

    // Save back to storage
    await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    // If we can't log the error, at least print it to console
    console.error('Failed to log error:', e);
    console.error('Original error:', error);
  }
};

/**
 * Get all stored error logs
 */
export const getErrorLogs = async (): Promise<ErrorLog[]> => {
  try {
    const logsJson = await AsyncStorage.getItem(ERROR_LOG_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
};

/**
 * Clear all stored error logs
 */
export const clearErrorLogs = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ERROR_LOG_KEY);
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
};

export default {
  initializeErrorHandler,
  logError,
  getErrorLogs,
  clearErrorLogs
};

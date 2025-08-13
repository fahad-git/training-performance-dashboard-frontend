// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Training Insights',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    debug: import.meta.env.DEV || false,
  },
  
} as const;

// Type for the config object
export type Config = typeof config;

// Helper function to get environment variable with fallback
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

// Helper function to check if we're in development mode
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

// Helper function to check if we're in production mode
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config/environment';
import { ServerApiResponse } from '../types/training';

// API Configuration
const API_CONFIG = {
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Create axios instance with interceptors
const createApiClient = (): AxiosInstance => {
  const client = axios.create(API_CONFIG);

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error handling
      if (error.response) {
        const { status, statusText, data } = error.response;
        const message = `API Error: ${status} ${statusText}`;
        
        console.error(message, { status, statusText, data });
        
        // Handle specific status codes
        switch (status) {
          case 401:
            // Unauthorized - redirect to login or refresh token
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            break;
          case 403:
            // Forbidden - show access denied message
            console.error('Access denied');
            break;
          case 404:
            // Not found - log for debugging
            console.error('Resource not found');
            break;
          case 500:
            // Server error - show generic error message
            console.error('Server error occurred');
            break;
        }
        
        return Promise.reject(new ApiError(message, status, statusText, data));
      } else if (error.request) {
        // Network error
        const message = 'Network error - no response received';
        console.error(message);
        return Promise.reject(new ApiError(message, 0, 'Network Error'));
      } else {
        // Other error
        console.error('Request setup error:', error.message);
        return Promise.reject(error);
      }
    }
  );

  return client;
};

// API client instance
const apiClient = createApiClient();

// API functions
export const insightsApi = {
  // Get server training data with filtering
  getServerTrainingData: async (filters?: {
    department?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ServerApiResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.department && filters.department !== 'All') {
        params.append('department', filters.department);
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }

      const queryString = params.toString();
      const url = queryString ? `/insights?${queryString}` : '/insights';
      
      const response = await apiClient.get<ServerApiResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch server training data:', error);
      throw error;
    }
  },
};
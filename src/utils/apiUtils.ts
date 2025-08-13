import { ApiError } from '../api/insightsApi';

/**
 * Format API error message for user display
 */
export const formatApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};

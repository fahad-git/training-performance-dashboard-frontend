import { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from '../api/insightsApi';

// Enhanced useQuery hook with better error handling
export const useEnhancedQuery = <TData, TError = ApiError>(
  options: UseQueryOptions<TData, TError> & {
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  }
) => {
  const { onSuccess, onError, ...queryOptions } = options;
  
  const query = useQuery({
    ...queryOptions,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle success and error callbacks
  useEffect(() => {
    if (query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.data, onSuccess]);

  useEffect(() => {
    if (query.error && onError) {
      console.error('Query error:', query.error);
      onError(query.error);
    }
  }, [query.error, onError]);

  return query;
};
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const messageSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Animated Spinner */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-blue-200 ${sizeClasses[size]}`}></div>
        
        {/* Animated inner ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 ${sizeClasses[size]} animate-spin`}></div>
        
        {/* Center dot */}
        <div className={`absolute inset-2 rounded-full bg-blue-600 ${size === 'sm' ? 'inset-1' : size === 'md' ? 'inset-1.5' : size === 'lg' ? 'inset-2.5' : 'inset-3'}`}></div>
      </div>
      
      {/* Loading message */}
      {message && (
        <div className="mt-4 text-center">
          <p className={`text-gray-600 font-medium ${messageSizes[size]} animate-pulse`}>
            {message}
          </p>
          {/* Animated dots */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};
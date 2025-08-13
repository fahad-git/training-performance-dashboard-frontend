import React from 'react';

interface ErrorBoundaryProps {
  error: string;
  onRetry: () => void;
  title?: string;
  className?: string;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  className = ""
}) => (
  <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
    <div className="text-center max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

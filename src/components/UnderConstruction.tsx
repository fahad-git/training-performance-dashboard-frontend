import React from 'react';
import { Construction, Wrench, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnderConstructionProps {
  pageName: string;
}

export const UnderConstruction: React.FC<UnderConstructionProps> = ({ 
  pageName
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Construction Icon */}
        <div className="relative mb-8">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="h-12 w-12 text-blue-600 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
            <Wrench className="h-4 w-4 text-yellow-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {pageName} Coming Soon
          </h1>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you this feature. This page is currently under development 
            and will be available soon with exciting new capabilities.
          </p>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Development Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000 ease-out"></div>
            </div>
          </div>

          {/* Features Coming */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Coming:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Advanced data visualization tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Interactive reporting features
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Real-time collaboration tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Enhanced user management
              </li>
            </ul>
          </div>

          {/* Estimated Timeline */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Estimated Launch</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">Q3 2025</p>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-gray-500 text-sm mt-6">
          Have questions or suggestions? Contact our development team at{' '}
          <a href="mailto:dev@traininginsights.com" className="text-blue-600 hover:underline">
            dev@traininginsights.com
          </a>
        </p>
      </div>
    </div>
  );
};
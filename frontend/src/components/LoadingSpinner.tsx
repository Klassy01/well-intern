import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-primary-600 font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

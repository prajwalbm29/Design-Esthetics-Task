import React from 'react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        
        <h1 className="text-3xl font-bold text-purple-400 mb-2">
          Loading
          <span className="animate-pulse">
            <span>.</span>
            <span className="delay-100">.</span>
            <span className="delay-200">.</span>
          </span>
        </h1>
        
        <p className="text-gray-400 max-w-md">
          Please wait while we prepare your experience
        </p>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-6 max-w-xs mx-auto">
          <div className="bg-purple-600 h-2.5 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
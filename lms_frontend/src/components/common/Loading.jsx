// src/components/common/Loading.jsx
import React from 'react';

const Loading = ({ fullScreen = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white z-50' : 'p-4'}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50 mb-2" />
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;

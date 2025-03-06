
import React from 'react';

const SettingsLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-48 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-4 w-36 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default SettingsLoading;

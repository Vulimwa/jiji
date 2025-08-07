import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">J</span>
      </div>
      <span className="text-xl font-bold text-gray-800">JijiSauti</span>
    </div>
  );
};

export default Logo;
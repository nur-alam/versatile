import React from "react";

const TemplateLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-72 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-36 mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default TemplateLoader;
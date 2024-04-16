// NotFound.js

import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RiErrorWarningLine className="text-red-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">404 Not Found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;

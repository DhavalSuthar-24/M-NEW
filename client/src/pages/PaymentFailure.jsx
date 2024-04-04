import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-red-200 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 text-red-600">Payment Failed</h2>
        <p className="text-gray-700 mb-4">We apologize, but your payment could not be processed at this time. Please try again later.</p>
        <Link to="/e-store" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md shadow-md focus:outline-none focus:ring focus:ring-red-400">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;

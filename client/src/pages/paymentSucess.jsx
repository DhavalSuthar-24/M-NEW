import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart,toggleCartVisibility } from '../redux/cart/cartSlice'; // Import the clearCart action from your Redux slice

const PaymentSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the clearCart action when the component mounts
    dispatch(clearCart());
    dispatch(toggleCartVisibility(false));
  }, [dispatch]); // Dependency array with dispatch as the dependency

  return (
    <div className="min-h-screen flex items-center justify-center b">
      <div className=" bg-green-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 ">Payment Successful!</h2>
        <p className="text-gray-700 mb-4">Your payment has been processed successfully. Thank you for your purchase!</p>
        <Link to="/e-store" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

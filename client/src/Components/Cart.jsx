import { FaTimes } from 'react-icons/fa'; // Importing close icon from react-icons/fa
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const Cart = ({ cartItems, updateQuantity, removeFromCart, isVisible, toggleVisibility }) => {
  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 0));
  }, 0);

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OySR3SH9ySesKUUIvonoDQvGUBaP67vQjXrPdfTulRuObuqvoUk0TCooKCI7jOyFOGRmWQXL4poJucjbqk8k33v00WVPocAY2');

    try {
      const body = {
        products: cartItems
      };

      const headers = {
        'Content-Type': 'application/json'
      };

      const response = await fetch('api/stripe/create-checkout-session', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      // Handle error, display message to user, etc.
    }
  };

  return isVisible ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={toggleVisibility}
        >
          <FaTimes />
        </button>
        <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center border-b py-4">
            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">Price: ₹{item.price}</p>
              <div className="flex items-center mt-2">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1 border">{item.quantity || 0}</span>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full ml-2 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => updateQuantity(item._id, (item.quantity || 0) + 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-full ml-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 text-green-400 font-semibold text-xl flex justify-between">
          <div>
            <span className='text-black'>Total: </span> ₹{totalAmount.toFixed(2)}
          </div>
          {/* Checkout Button */}
          <button onClick={makePayment} className='bg-blue-500 p-2 border rounded-full hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>Checkout</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Cart;

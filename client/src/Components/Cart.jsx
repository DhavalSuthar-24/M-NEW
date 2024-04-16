import { FaTimes } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { updateQuantity, removeFromCart, toggleCartVisibility } from '../redux/cart/cartSlice';
import { Link } from 'react-router-dom';


const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartVisible = useSelector(state => state.cart.cartVisible);
  const [totalAmount, setTotalAmount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const toggleVisibility = () => {
    dispatch(toggleCartVisibility());
  }

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce((total, item) => {
        return total + (item.price * (item.quantity || 0));
      }, 0);
      setTotalAmount(total);
    };
    calculateTotal();

  }, [cartItems]);

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OySR3SH9ySesKUUIvonoDQvGUBaP67vQjXrPdfTulRuObuqvoUk0TCooKCI7jOyFOGRmWQXL4poJucjbqk8k33v00WVPocAY2');

    try {
      const body = {
        products: cartItems, // Array of products in the cart
        userId: currentUser._id, // User ID of the current user
        username: currentUser.username, // Username of the current user
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
    }
  };

  const handleUpdateQuantity = (itemId, size, newQuantity) => {
    dispatch(updateQuantity({ itemId, size, newQuantity }));
  };

  const handleRemoveFromCart = (itemId, size) => {
    dispatch(removeFromCart({ itemId, size }));
  };

  return cartVisible ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="max-w-4xl mx-auto  bg-white  shadow-lg rounded-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={toggleVisibility}
        >
          <FaTimes />
        </button>
        <h2 className="text-3xl font-bold mb-4 dark:text-black">Shopping Cart</h2>
        {cartItems.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center border-b py-4">
            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3><div className="flex justify-between">
                <p className="text-gray-600">Price: ₹{item.price}</p>{item.category === 'clothes' && (
                  <p className="text-gray-600">Size: <span className='font-semibold'>{item.size}</span></p>)}
              </div>


              <div className="flex items-center mt-2  ">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => handleUpdateQuantity(item._id, item.size, Math.max(1, (item.quantity || 1) - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1 border text-gray-500">{item.quantity || 0}</span>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full ml-2 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => handleUpdateQuantity(item._id, item.size, (item.quantity || 0) + 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-full ml-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => handleRemoveFromCart(item._id, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 text-green-400 font-semibold text-xl flex justify-between">
          <div className='text-center'>
            <span className='text-black'>Total: </span> ₹{totalAmount.toFixed(2)}
          </div>
          {currentUser ? (
            // Render the "Checkout" button for authenticated users
            <button onClick={makePayment} className='bg-blue-500 p-2 border rounded-full hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              Checkout
            </button>
          ) : (
            // Render the link for non-authenticated users
            <Link to="/sign-in" className="ml-3 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-300">
              Login to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
export default Cart;

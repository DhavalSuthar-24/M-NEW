import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, toggleCartVisibility, removeFromCart,clearCart } from '../redux/cart/cartSlice';
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../Components/ProductCard";
import Cart from "../Components/Cart";

const Projects = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.products);
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartVisible = useSelector(state => state.cart.cartVisible);
  const [localProducts, setLocalProducts] = useState([]);
  const isDarkMode = useSelector(state => state.theme.darkMode); // Add this line to get dark mode state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/product/getProducts');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setLocalProducts(data.products); // Set products locally
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateQuantity({ itemId, newQuantity }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleToggleCartVisibility = () => {
    dispatch(toggleCartVisibility());
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}> {/* Use dynamic class based on dark mode state */}
      <nav className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-600'} text-white`}> {/* Use dynamic class based on dark mode state */}
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/e-store" className="font-bold text-lg">DKS Blog</Link>
          <button onClick={handleToggleCartVisibility} className="relative hover:text-indigo-200 transition duration-200 text-2xl focus:outline-none">
            <FaShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-2 text-xs">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'} mb-8`}>Our Products</h2> {/* Use dynamic class based on dark mode state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {localProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Render Cart component with props */}
      <Cart
        cartItems={cartItems}
        updateQuantity={handleUpdateQuantity}
        isVisible={cartVisible}
        removeFromCart={handleRemoveFromCart}
        toggleVisibility={handleToggleCartVisibility}
      />
    </div>
  );
}

export default Projects;

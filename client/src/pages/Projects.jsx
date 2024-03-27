import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../Components/ProductCard";
import Cart from "../Components/Cart";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false); // State to control cart visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/product/getProducts');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + 1
      };
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item._id !== itemId)
    );
  };

  const toggleCartVisibility = () => {
    setCartVisible(!cartVisible);
    console.log("leo")
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/e-store" className="font-bold text-lg">DKS Blog</Link>
          <button onClick={toggleCartVisibility} className="relative hover:text-indigo-200 transition duration-200 text-2xl focus:outline-none">
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
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              
                <ProductCard product={product} addToCart={addToCart} />
             
            ))}
          </div>
        </div>
      </section>
      {/* Render Cart component with props */}
      <Cart cartItems={cartItems} updateQuantity={updateQuantity} isVisible={cartVisible} removeFromCart={removeFromCart} toggleVisibility={toggleCartVisibility} />
    </div>
  );
}

export default Projects;

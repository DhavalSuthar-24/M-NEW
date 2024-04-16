import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, toggleCartVisibility, removeFromCart } from '../redux/cart/cartSlice';
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../Components/ProductCard";
import Cart from "../Components/Cart";

const Projects = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const productsPerPage = 9;
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartVisible = useSelector(state => state.cart.cartVisible);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/product/getproducts?page=${currentPage}&limit=${productsPerPage}&searchTerm=${searchTerm}`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      setProducts(prevProducts => [...prevProducts, ...data.products]);
      setSearchedProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset current page when searching
  };

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

  const handleShowMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <Link to="/e-store" className="font-bold text-lg">DKS Blog</Link>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search products"
            className="px-4 py-2 border border-gray-300 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 mr-4"
            value={searchTerm}
            onChange={handleSearch}
          />
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
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={handleAddToCart}
              />
            ))}
          </div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && products.length < totalProducts && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-4 py-2 border border-indigo-600 rounded-full focus:outline-none bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </section>
      <Cart
        cartItems={cartItems}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
      />
    </div>
  );
}

export default Projects;

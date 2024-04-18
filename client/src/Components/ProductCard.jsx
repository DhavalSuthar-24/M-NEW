import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const croppedTitle =
    product.title && product.title.length > 20
      ? product.title.slice(0, 15) + "..."
      : product.title;

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`mt-4 relative overflow-hidden bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300 transition-transform transform hover:scale-105 ${
          hovered ? "z-10" : ""
        }`}
        style={{ width: "250px", height: "400px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-w-3 aspect-h-4">
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="cursor-pointer block"
          >
            <img
              src={product.image}
              alt={hovered ? product.title : "Product Image"}
              className="object-cover w-full h-full"
              style={{ minHeight: "100%", maxHeight: "100%" }}
            />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
          <h2 className="text-lg font-normal mb-2 line-clamp-2">{croppedTitle}</h2>
          <p className="text-gray-700 font-medium">$ {product.price}</p>
          <button
            onClick={handleAddToCart}
            className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

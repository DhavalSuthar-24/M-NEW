import { Link } from "react-router-dom";
import { useState } from "react";

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

  // Check if product.title exists before accessing its length
  const croppedTitle = product.title && product.title.length > 15 ? product.title.slice(0, 15) + '...' : product.title;

  return (
<div className="max-w-md mx-auto">
      <div 
        className="mt-4 relative overflow-hidden bg-white rounded-lg shadow-lg" 
        style={{ width: "250px", height: "400px" }} // Fixed height for consistency
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-w-3 aspect-h-4">
          <Link key={product._id} to={`/product/${product._id}`} className="cursor-pointer block">
            <img 
              src={product.image} 
              alt={hovered ? product.title : "Product Image"} 
              className="object-cover w-full h-full"
              style={{ minHeight: "100%", maxHeight: "100%" }} // Ensure image fills the container
            />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">{croppedTitle}</h2>
          <p className="text-gray-700 font-medium">₹ {product.price}</p>
          <button onClick={handleAddToCart} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Add to Cart</button>
        </div>
      </div>
    </div>


  
  
  
  );
}

export default ProductCard;

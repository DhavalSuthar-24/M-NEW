import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import ReviewSection from "./ReviewSection";



const ProductView = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(""); // Changed from 'products' to 'product'

  const [selectedSize, setSelectedSize] = useState('L');
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const [quantity, setQuantity] = useState(1); // Default quantity is zero
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/getProduct/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);
  
  useEffect(() => {
    if (product) {
      // Set the discounted price here after ensuring that the product state has been updated
      if (!discountApplied) {
        // If no coupon applied, set the discounted price to the original product price
        setDiscountedPrice(product.price);
      }
    }
  }, [product]);
  
  
  const handleAddToCart = () => {
    dispatch(addToCart({...product,size:selectedSize})); // Dispatch addToCart action with selected product
  };
  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCouponCode = async () => {
    try {
      const response = await fetch(`/api/coupon/check/${couponCode}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check coupon validity');
      }
  
      if (!data.coupon) {
        throw new Error('Coupon not found');
      }
  
      if (data.coupon.isUsed) {
        setDiscountedPrice(product.price);
        setDiscountApplied(false);
        setError('Coupon has already been used'); // Set error message
        return;
      }
  
      setDiscountApplied(true);
      const { discountType, discountValue } = data.coupon;
      setDiscountType(discountType);
      setDiscountValue(discountValue);
      let newDiscountedPrice;
      if (discountType === 'percentage') {
        newDiscountedPrice = (product.price * (1 - discountValue / 100)).toFixed(2);
      } else {
        newDiscountedPrice = (product.price - discountValue).toFixed(2);
      }
      setDiscountedPrice(newDiscountedPrice);
  
      const markUsedResponse = await fetch(`/api/coupon/mark-used/${couponCode}`, {
        method: 'POST',
      });
  
      if (!markUsedResponse.ok) {
        throw new Error('Failed to mark coupon as used');
      }
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message
    }
  };
  
  
  
  
  
  
  

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OySR3SH9ySesKUUIvonoDQvGUBaP67vQjXrPdfTulRuObuqvoUk0TCooKCI7jOyFOGRmWQXL4poJucjbqk8k33v00WVPocAY2');
  
    try {
      // Check if a coupon is applied
      if (!discountApplied) {
        // If no coupon applied, set the discounted price to the original product price
        setDiscountedPrice(product.price);
      }
  
      // Now, proceed with the payment process
  
      const updatedProduct = { ...product,size:selectedSize, price: discountedPrice, quantity };
  
      const updatedProductsArray = [updatedProduct];
  
      const body = {
        products: updatedProductsArray,
        userId:currentUser._id
      };
  
      const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  
  



  useEffect(() => {
    if (product) {
      console.log('Product:', product.price);
    }
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (<>
    <div className="flex flex-col md:flex-row items-start md:items-center">
     <div className="w-full md:w-1/2 p-4 flex justify-center items-center h-full">
  <img 
    src={selectedImage} 
    alt={product.title} 
    className="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition duration-300" 
    style={{ maxHeight: "100%", maxWidth: "100%" }} // Ensure the image fills its container while maintaining its aspect ratio
  />
</div>
      <div className="w-full md:w-1/2 p-4">
        <div className="flex mb-4">
          <img
            src={product.image}
            alt="Thumbnail 1"
            className="w-16 h-16 rounded-lg shadow-md cursor-pointer mr-2"
            onClick={() => handleThumbnailClick(product.image)}
          />
          {product.image1 && (
            <img
              src={product.image1}
              alt="Thumbnail 2"
              className="w-16 h-16 rounded-lg shadow-md cursor-pointer mr-2"
              onClick={() => handleThumbnailClick(product.image1)}
            />
          )}
          {product.image2 && (
            <img
              src={product.image2}
              alt="Thumbnail 3"
              className="w-16 h-16 rounded-lg shadow-md cursor-pointer mr-2"
              onClick={() => handleThumbnailClick(product.image2)}
            />
          )}
        </div>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-4">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <div className="mb-4">
          <p className="text-lg text-gray-800">
          {discountApplied ? (
  <span>
    <span className="text-red-500 line-through">${product.price}</span>
    &nbsp; &nbsp;
    {discountType === 'percentage' ? (
      <span>{discountValue}% Discount Applied</span>
    ) : (
      <span>${discountValue} Discount Applied</span>
    )}
    &nbsp; &nbsp;
    <br />
    <span >New Price: <span className="font-bold" >  ₹{discountedPrice}</span></span>
  </span>
) : (
  <span className="dark:text-white">${product.price}</span>
)}

          </p>
        </div>
        <div className="mb-4">
      <div className="flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300" onClick={handleAddToCart}>Add to Cart</button>
        {currentUser ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300" onClick={makePayment}>
            Buy Now
          </button>
        ) : (
          <Link to="/sign-in" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
            Sign In to Buy
          </Link>
        )}
      </div>
    </div>
    <div className='mb-4'>
  {product.category === 'clothes' && (
    <div>
      <h2 className='text-xl font-bold mb-2'>Available Sizes:</h2>
      <div className='flex'>
        <button
          className={`bg-purple-300 hover:bg-purple-400 text-gray-800 px-4 py-2 rounded mr-2 ${
            selectedSize === 'S' ? 'bg-purple-500 text-white' : ''
          }`}
          onClick={() => handleSizeSelect('S')}
        >
          S
        </button>
        <button
          className={`bg-purple-300 hover:bg-purple-400 text-gray-800 px-4 py-2 rounded mr-2 ${
            selectedSize === 'M' ? 'bg-purple-500 text-white' : ''
          }`}
          onClick={() => handleSizeSelect('M')}
        >
          M
        </button>
        <button
          className={`bg-purple-300 hover:bg-purple-400 text-gray-800 px-4 py-2 rounded mr-2 ${
            selectedSize === 'L' ? 'bg-purple-500 text-white' : ''
          }`}
          onClick={() => handleSizeSelect('L')}
        >
          L
        </button>
        <button
          className={`bg-purple-300 hover:bg-purple-400 text-gray-800 px-4 py-2 rounded mr-2 ${
            selectedSize === 'XL' ? 'bg-purple-500 text-white' : ''
          }`}
          onClick={() => handleSizeSelect('XL')}
        >
          XL
        </button>
        <button
          className={`bg-purple-300 hover:bg-purple-400 text-gray-800 px-4 py-2 rounded mr-2 ${
            selectedSize === 'XXL' ? 'bg-purple-500 text-white' : ''
          }`}
          onClick={() => handleSizeSelect('XXL')}
        >
          XXL
        </button>
      </div>
    </div>
  )}
</div>

    <div
        className='p-3 max-w-2xl mx-auto w-full '
        dangerouslySetInnerHTML={{ __html: product && product.content }}
      ></div>
        <div className="mt-5 ">
          <input type="text" value={couponCode} onChange={handleCouponCodeChange} placeholder="Enter coupon code" className="border border-gray-400 rounded px-3 py-2 mr-2" />
          <button onClick={applyCouponCode} className="bg-gray-800 text-white px-4 py-2 mt-2 rounded hover:bg-gray-900 transition duration-300">Apply Coupon</button>
          {error && <p className="text-red-600 mt-2">{error}</p>} {/* Display error message */}
        </div>
        {discountApplied && (
          <p className="text-green-600 mt-2">Discount applied successfully!</p>
        )}


      </div>
 
    </div>
    <ReviewSection id={id}/>
    </>
  );
};

export default ProductView;

import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';

const ProductView = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/getProduct/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image); // Set the initial selected image
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCouponCode = async () => {
    try {
      const response = await fetch(`/api/coupon/check/${couponCode}`);
      if (!response.ok) {
        throw new Error('Failed to check coupon validity');
      }
      const data = await response.json();
      if (!data.coupon.isUsed && !discountApplied) { // Check if coupon is not used and discount is not already applied
        setDiscountApplied(true);
        // Extract discount information from the coupon object
        const { discountType, discountValue } = data.coupon;
        setDiscountType(discountType);
        setDiscountValue(discountValue);
        // Calculate discounted price
        let newDiscountedPrice;
        if (discountType === 'percentage') {
          // Apply percentage discount
          newDiscountedPrice = (product.price * (1 - discountValue / 100)).toFixed(2);
        } else {
          // Apply fixed value discount
          newDiscountedPrice = (product.price - discountValue).toFixed(2);
        }
        setDiscountedPrice(newDiscountedPrice);
        // Update the product price based on the validity of the coupon
        setProduct(prevProduct => ({
          ...prevProduct,
          price: newDiscountedPrice // Set the discounted price
        }));
        console.log('Updated price:', newDiscountedPrice); // Log the updated price
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };


  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OySR3SH9ySesKUUIvonoDQvGUBaP67vQjXrPdfTulRuObuqvoUk0TCooKCI7jOyFOGRmWQXL4poJucjbqk8k33v00WVPocAY2');
  
    try {
      // Update product price to discountedPrice
      const updatedProduct = { ...product, price: discountedPrice,quantity:1 };
  
      const body = {
        product: updatedProduct
      };
  console.log(body)
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
  // const makePayment = async () => {
  //   const stripe = await loadStripe('pk_test_51OySR3SH9ySesKUUIvonoDQvGUBaP67vQjXrPdfTulRuObuqvoUk0TCooKCI7jOyFOGRmWQXL4poJucjbqk8k33v00WVPocAY2');

  //   try {
  //     const updatedProduct = { ...product, price: discountedPrice };
  //     const body = {
  //       product: updatedProduct
  //     };

  //     const headers = {
  //       'Content-Type': 'application/json'
  //     };

  //     const response = await fetch('api/stripe/create-checkout-session', {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(body)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create checkout session');
  //     }

  //     const session = await response.json();

  //     const result = await stripe.redirectToCheckout({
  //       sessionId: session.id
  //     });

  //     if (result.error) {
  //       throw new Error(result.error.message);
  //     }
  //   } catch (error) {
  //     console.error("Error creating checkout session:", error);
  //     // Handle error, display message to user, etc.
  //   }
  // };

  useEffect(() => {
    if (product) {
      console.log('Product:', product);
    }
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center">
      <div className="w-full md:w-1/2 p-4 flex justify-center">
        <img src={selectedImage} alt={product.title} className="w-full md:w-64 rounded-lg shadow-md hover:scale-105 transition duration-300" />
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
                <span className="font-bold">New Price: ${discountedPrice}</span>
              </span>
            ) : (
              <span>${product.price}</span>
            )}
          </p>
        </div>
        <div className="mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 transition duration-300">Add to Cart</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300" onClick={makePayment}>Buy Now</button>
        </div>
        <p className="text-gray-700">{product.content}</p>
        <div className="mt-4">
          <input type="text" value={couponCode} onChange={handleCouponCodeChange} placeholder="Enter coupon code" className="border border-gray-400 rounded px-3 py-2 mr-2" />
          <button onClick={applyCouponCode} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-300">Apply Coupon</button>
        </div>
        {discountApplied && (
          <p className="text-green-600 mt-2">Discount applied successfully!</p>
        )}
      </div>
    </div>
  );
};

export default ProductView;

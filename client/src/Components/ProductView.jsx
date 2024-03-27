import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductView = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

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
      if (data.valid) {
        setDiscountApplied(true);
        // Extract discount information from the coupon object
        const { discountType, discountValue } = data.coupon;
        // Update the product price based on the validity of the coupon
        if (discountType === 'percentage') {
          // Apply percentage discount
          setProduct(prevProduct => ({
            ...prevProduct,
            price: prevProduct.price * (1 - discountValue / 100) // Apply percentage discount
          }));
        } else {
          // Apply fixed value discount
          setProduct(prevProduct => ({
            ...prevProduct,
            price: prevProduct.price - discountValue // Apply fixed value discount
          }));
        }
      } else {
        setDiscountApplied(false);
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  
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
        <p className="text-lg text-gray-800 mb-4">${product.price}</p>
        <div className="mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 transition duration-300">Add to Cart</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Buy Now</button>
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

import  { useState, useEffect,useRef } from 'react';
import { useParams,Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

const OrderDetails = () => {
  const { orderId } = useParams();
  const billRef = useRef(null); // Get orderId from route params
  const [orderDetails, setOrderDetails] = useState(null); // State to store order details
  const [loading, setLoading] = useState(false);
  const [emailSent,setEmail]= useState(false)
  // const [error, setError] = useState(null);



  const downloadBill = async () => {
    setLoading(true);

    // Adjust capture settings
    const canvas = await html2canvas(billRef.current, {
      scale: 2, // Increase scale for better quality
      useCORS: true, // Enable CORS support
      scrollX: 0, // Disable scrolling in X-axis
      scrollY: 0, // Disable scrolling in Y-axis
    });

    // Convert the canvas image to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `order_${orderDetails._id}.png`;

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    setLoading(false);
  };
  const sendBillByEmail = async () => {
    setLoading(true);
  
    const canvas = await html2canvas(billRef.current, {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });
  
    const dataUrl = canvas.toDataURL('image/png');
  
    try {
      const response = await fetch('/api/order/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: orderDetails.shipping.email,
          image: dataUrl,
          orderId: orderDetails._id,
        }),
      });
  
      if (response.ok) {
        setEmailSent(true);
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  
    setLoading(false);
  };
  


  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/order/${orderId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await res.json();
        
        // Fetch product details for each product in the order
        const productsWithDetails = await Promise.all(
          data.products.map(async (product) => {
            const productRes = await fetch(`/api/product/getproduct/${product.productId}`);
            if (!productRes.ok) {
              throw new Error(`Failed to fetch product details for product ID: ${product.productId}`);
            }
            const productData = await productRes.json();
            return {
              ...product,
              productDetails: productData, // Add product details to the product object
            };
          })
        );

        // Update orderDetails state with products containing details
        setOrderDetails({ ...data, products: productsWithDetails });
      } catch (error) {
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    



  

    // Cleanup function
  }, [orderId]);
  // const total = { ...orderDetails, total };
  // const fTotal =total.toFixed(2)
  console.log(orderDetails)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>{orderDetails &&(
    <div ref={billRef} className="bg-purple-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg  md:w-2/3  aspect-auto lg:w-1/2 mx-auto h-auto my-6 " >
    {/* Title */}
    <Link to="/e-store" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-3  pt-2 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>DkS Store</span>
      </Link>
  
    {/* Store Address */}
    <div className="flex justify-between mb-4 mt-5">
      <div>
        <p className="mb-2 font-semibold">Address: <span className='font-normal'>Paldi, Ahmedabad</span></p>
        {/* Customer Name and Contact Email */}
   
        <p className="mb-2 font-semibold">Customer Name: <span className="font-normal">{orderDetails?.shipping?.name}</span></p>
      
        
        {/* Customer Address */}
        <p className="mb-4 font-semibold">Customer Address: <span className="font-normal">{orderDetails?.shipping?.address?.line1}, {orderDetails?.shipping?.address?.city}, {orderDetails?.shipping?.address?.postal_code}</span></p>
      </div>
      {/* Order Date */}
      <div>
        <p className="mb-4 font-semibold">Order Date: <span className="font-normal"> {formatDate(orderDetails?.createdAt)}</span></p>
        <p className="mb-3 font-semibold ">Email: <span className="font-normal">{orderDetails?.shipping?.email}</span></p>
      </div>


    </div>
    <p className="font-normal mb-2">bill no : <span className='font-thin'>{orderDetails._id}</span></p>
    {/* Products Table */}
    <table className="w-full mb-4">
      <thead>
        <tr>
          <th className="px-4 py-2 font-semibold border">Index</th>
          <th className="px-4 py-2 font-semibold border">Product Title</th>
          <th className="px-4 py-2 font-semibold border">Quantity</th>
          <th className="px-4 py-2 font-semibold border">Price</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails?.products?.map((product, index) => (
          <tr key={product.productId}>
            <td className="border px-4 py-2 text-center">{index + 1}</td>
            <td className="border px-4 py-2 text-center">{product?.productDetails?.title}</td>
            <td className="border px-4 py-2 text-center">{product.quantity}</td>
            <td className="border px-4 py-2  text-center">${(product.quantity * product?.productDetails?.price).toFixed(2)}</td>
          </tr>
        ))}
        <tr className='text-center'>
          <td className="border px-4 py-2"></td>
          <td className="border px-4 py-2"></td>
          <td className="border px-4 py-2 font-semibold text-center">Total :</td>
          <td className="border px-4 py-2 font-normal text-center">${(orderDetails.total/100).toFixed(2)} </td>
        </tr>
      </tbody>
    </table>
    <p className="text-center font-light mt-3">Thanks for shopping at DkS Store!  ❤</p>
    
  </div>)
} 
<div className=" flex justify-evenly items-center mx-auto mt-3 mb-4  ">
<button
        className={`bg-blue-400 hover:bg-blue-700  text-white font-semibold py-2 px-4 rounded  ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={downloadBill}
        disabled={loading}
      >
        {loading ? 'Downloading...' : 'Download Bill'}
      </button>
      <button
    className={`bg-blue-400 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${
      loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={sendBillByEmail}
    disabled={loading || emailSent} // Disable button if loading or email already sent
  >
    {loading ? 'Sending Email...' : 'Send Bill via Email'}
  </button>
</div>


 </>
  
  
  

  
  
  );
};

export default OrderDetails;

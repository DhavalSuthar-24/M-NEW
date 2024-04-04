import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import './styles.css';

const Order = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ordersWithProducts, setOrdersWithProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Order Confirmation"); // Initialize with "Order Confirmation"
  const [highlightWidth, setHighlightWidth] = useState("0%"); // Initial width of highlight

  useEffect(() => {
    const fetchUserOrdersWithProducts = async () => {
      try {
        if (currentUser && currentUser._id) {
          const response = await axios.get(`/api/user/${currentUser._id}`);
          const userOrders = response.data.orders;
          const ordersWithProducts = [];

          for (const orderId of userOrders) {
            const orderResponse = await axios.get(`/api/order/${orderId}`);
            const order = orderResponse.data;
            const productDetails = await Promise.all(
              order.products.map(async (product) => {
                const productResponse = await axios.get(`/api/product/getproduct/${product.productId}`);
                return productResponse.data;
              })
            );
            ordersWithProducts.push({ ...order, productsDetails: productDetails });
          }

          setOrdersWithProducts(ordersWithProducts);
          console.log("Orders with products:", ordersWithProducts); // Log ordersWithProducts to the console
        }
      } catch (error) {
        console.error("Error fetching user orders:", error.response ? error.response.data : error.message);
      }
    };
    
    fetchUserOrdersWithProducts();
  }, [currentUser]);

  useEffect(() => {
    // Set a timeout to toggle order status from "Order Confirmation" to "Pending" after 2 seconds
    const timeout = setTimeout(() => {
      setOrderStatus("Pending");
    }, 2000);

    // Update highlight width based on order status
    setHighlightWidth(orderStatus === "Order Confirmation" ? "0%" : orderStatus === "Pending" ? "50%" : "100%");

    return () => clearTimeout(timeout);
  }, [orderStatus]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleString('en-IN', options);
    return formattedDate;
  };

  return (
    <div className="order-container flex flex-wrap justify-center w-full gap-11">
      {ordersWithProducts.map((order) => (
        <div key={order._id} className="p-8 m-4 rounded shadow-lg w-full">
          <h5 className="text-lg font-bold mb-4">Order ID: {order._id}</h5>
          {order.productsDetails.map((product, index) => (
            <div key={product._id} className="order-product mb-4">
              <div className="flex items-start ml-10">
                <div className="flex flex-col"> {/* New div for image and quantity */}
                  <img src={product.image} alt={product.title} className="w-20 h-auto rounded-lg mb-2" />
                  <p>Quantity: {order.products[index].quantity}</p>
                </div>
                <div className="flex-grow ml-4"> {/* Adjusted margin to separate image and product details */}
                  <div className="flex justify-between items-end">
                    <div> {/* New div for title and date */}
                      <h6 className="text-lg font-bold mb-1">{product.title}</h6>
                      <div>
                        <p>Order Date: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right"> {/* Apply text-right class here */}
                      {/* Content for right side, if any */}
                    </div>
                  </div>
                </div>
              </div>
              {index !== order.products.length - 1 && <hr className="my-4" />} {/* Horizontal line between products */}
            </div>
          ))}
          <p className="text-right font-bold">Total: ${(order.total / 100).toFixed(2)}</p>
          {/* Progress bar-like element */}


<div className="progress-bar">
  <div className={`progress ${orderStatus !== "Order Confirmation" ? "active" : ""}`} style={{ width: highlightWidth }}></div>
  <div className="phase" style={{ left: '3%' }}>Order Confirmation</div>
  <div className="phase" style={{ left: '50%' }}>Shipping</div>
  <div className="phase" style={{ left: '100%' }}>Delivered</div>
  <div className="circle" style={{ left: '0%' }}></div>
  <div className="circle" style={{ left: '50%' }}></div>
  <div className="circle" style={{ left: '100%' }}></div>
</div>

        </div>
      ))}
    </div>
  );
};

export default Order;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import './styles.css';
import { Link } from "react-router-dom";

const Order = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ordersWithProducts, setOrdersWithProducts] = useState([]);

  useEffect(() => {
    const fetchUserOrdersWithProducts = async () => {
      try {
        if (currentUser && currentUser._id) {
          const response = await axios.get(`/api/user/${currentUser._id}`);
          const userOrders = response.data.orders;
          if (userOrders.length === 0) {
            // No orders found, handle the case gracefully
            setOrdersWithProducts([]);
            return;
          }
          const ordersWithProducts = [];
          for (const orderId of userOrders) {
            try {
              const orderResponse = await axios.get(`/api/order/${orderId}`);
              const order = orderResponse.data;
              const productDetails = await Promise.all(
                order.products.map(async (product) => {
                  const productResponse = await axios.get(`/api/product/getproduct/${product.productId}`);
                  return productResponse.data;
                })
              );
              ordersWithProducts.push({ ...order, productsDetails: productDetails });
            } catch (error) {
              console.error(`Error fetching order ${orderId}:`, error.response ? error.response.data : error.message);
              // If order not found, continue to the next order
              continue;
            }
          }
          setOrdersWithProducts(ordersWithProducts);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error.response ? error.response.data : error.message);
      }
    };
    fetchUserOrdersWithProducts();
  }, [currentUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOrderStatus("Pending");
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleString('en-IN', options);
    return formattedDate;
  };

  if (ordersWithProducts.length === 0) {
    return <div className="w-full h-full flex justify-center items-center p-32">You have not ordered anything yet.</div>;
  }

  return (
    <div className="order-container flex flex-wrap justify-center w-full gap-11">
      {ordersWithProducts.map((order) => (
        <div key={order._id} className="p-8 m-4 rounded shadow-lg w-full">
          <h5 className="text-lg font-bold mb-4">Order ID: {order._id}</h5>
          {order.productsDetails.map((product, index) => (
            <div key={product._id} className="order-product mb-4">
              <div className="flex items-start ml-10">
                <div className="flex flex-col"><Link  to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.title} className="w-20 h-auto rounded-lg mb-2" /></Link>
                  <p>Quantity: {order.products[index].quantity}</p>
                </div>
                <div className="flex-grow ml-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <Link to={`orderDetails/${order._id}`}>
                      <h6 className="text-lg font-bold mb-1">{product.title}</h6>
                      <div>
                        <p>Order Date: {formatDate(order.createdAt)}</p>
                      </div>
                      </Link>
                    </div>
                    <div className="text-right">
                      {/* Content for right side, if any */}
                    </div>
                  </div>
                </div>
              </div>
              {index !== order.products.length - 1 && <hr className="my-4" />}
            </div>
          ))}
          <p className="text-right font-bold">Total: ${(order.total / 100).toFixed(2)}</p>
          <div className="progress-bar">
            <div className={`progress ${order.orderConfirmation ? "active" : ""}`} style={{ width: order.orderConfirmation ? "50%" : "3%" }}></div>
            <div className={`progress ${order.delivery_status === "delivered" ? "active" : ""}`} style={{ width: order.delivery_status === "delivered" ? "100%" : "0%" }}></div>
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

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Order = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ordersWithProducts, setOrdersWithProducts] = useState([]);

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
            ordersWithProducts.push({ ...order, productss: productDetails });
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
  

  return (
    <div className="order-container flex flex-wrap justify-center">
      {ordersWithProducts.map((order) => (
        <div key={order._id} className="order-card bg-gray-100 p-8 m-4 rounded shadow-lg max-w-screen-sm w-full md:w-2/3 lg:w-1/3">
          <h5 className="text-lg font-bold mb-4">Order ID: {order._id}</h5>
          {
          order.productss.map((product, index) => 
            (
            <div key={product._id} className="order-product mb-4">
              <div className="flex items-start">
                <img src={product.image} alt={product.title} className="w-20 h-auto rounded-lg mr-4" />
                <div className="flex-grow">
                  <h6 className="text-lg font-bold mb-1">{product.title}</h6>
                  <p>{order.createdAt}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p>Amount: {(order.subtotal/100).toFixed(2)}</p>
                  <p>Quantity: {order.products.reduce((total, product) => total + product.quantity, 0)}</p>

                </div>
              </div>
              {index !== order.products.length - 1 && <hr className="my-4" />} {/* Horizontal line between products */}
            </div>
          ))}
       <p className="text-right font-bold">Total: ${(order.total / 100).toFixed(2)}</p>

        </div>
      ))}
    </div>
  );
};

export default Order;

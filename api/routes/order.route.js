import express from 'express';
import { Order } from '../models/order.model.js';
import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import User from '../models/user.model.js';
import nodemailer from 'nodemailer'

const router = express.Router();

// Route to get all orders
router.get("/getorders", async (req, res) => {
  try {
      const orders = await Order.find().populate({
          path: 'products.productId',
          model: 'Product'
      });
      res.status(200).json(orders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get orders with selected fields
router.get("/getOrdersDetails", async (req, res) => {
  try {
      const orders = await Order.find().select('_id createdAt orderConfirmation subtotal delivery_status products')
          .populate({
              path: 'products.productId',
              select: 'title image price category', // Remove 'quantity' from select
          })
          .populate({
              path: 'userId',
              select: 'username',
              model: 'User'
          });

      const formattedOrders = orders.map(order => {
          return {
              _id: order._id,
              orderDate: order.createdAt,
              orderConfirmation: order.orderConfirmation,
              subtotal: order.subtotal,
              deliveryStatus: order.delivery_status,
              products: order.products.map(product => {
                  return {
                      quantity: product.quantity, // Access 'quantity' directly from the product object
                      title: product.productId.title,
                      image: product.productId.image,
                      price: product.productId.price,
                      category: product.productId.category

                  };
              }),
              user: order.userId.username
          };
      });

      res.status(200).json(formattedOrders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});






// Route to get order by orderId
router.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid orderId format" });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      console.log(`Order with ID ${orderId} not found`);
      // Skip the current order and continue execution for the next order ID
      return res.status(204).send(); // Return a 204 No Content response
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  router.put("/confirm/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ message: "Invalid orderId format" });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Update the orderConfirmation field to true
      order.orderConfirmation = true;
      await order.save();
  
      // Send an email to the user
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dhavalllsuthar@gmail.com',
          pass: 'gevc awpo lpnb zket'
        }
      });
  
      const mailOptions = {
        from: 'DkS e-store <DKS@GMAIL.COM>',
        to: order.shipping.email,
        subject: 'Order Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Confirmation</h1>
            <p style="color: #666;">Dear Customer,</p>
            <p style="color: #666;">Your order with ID ${order._id} has been confirmed and is now in the shipping phase. Thank you for shopping with us!</p>
            <p style="color: #666;">Order Subtotal: $${(order.subtotal / 100).toFixed(2)}</p>
         <p>For more contact us on following mail id:</p>
            <a href= "mailto:dhavalllsuthar@gmail.com " >dhavalllsuthar@gmail.com </a>  
            <div style="text-align: center;">
              <img src="https://imgs.search.brave.com/Z-7VEskp2ugQIxhvLlPM8DHug_bQI7hvsLO0ox6O0o0/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/d29yZHN0cmVhbS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDcvdGhhbmst/eW91LWZvci15b3Vy/LXB1cmNoYXNlLXRl/bXBsYXRlLTYucG5n" alt="Product Photo" style="max-width: 100%; height: auto;">
            </div>
          </div>
        `
      };
      
      
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed to send email" });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: "Order confirmed successfully and email sent", order });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // Route to cancel an order by orderId
  router.put("/cancel/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ message: "Invalid orderId format" });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Send an email to the customer about order cancellation
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dhavalllsuthar@gmail.com',
          pass: 'gevc awpo lpnb zket'
        }
      });
  
      const mailOptions = {
        from: '"Your Company Name" <noreply@example.com>',
        to: order.shipping.email,
        subject: 'Order Cancellation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Cancellation</h1>
            <p style="color: #666;">Dear Customer,</p>
            <p style="color: #666;">We are sorry to inform you that your order with ID ${order._id} has been cancelled due to unforeseen circumstances. We apologize for any inconvenience caused.</p>
            <p style="color: #666;">If you have any questions or concerns, please feel free to contact us at <a href="mailto:dhavalllsuthar@gmail.com">dhavalllsuthar@gmail.com</a>.</p>
            <div style="text-align: center;">
              <img src="https://imgs.search.brave.com/KSWPOv-_Ip0xbgfR9K0_sLVQRdeJsiIU7GwvQFsfUMo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWxlZ2FudHRoZW1l/cy5jb20vYmxvZy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9jYW5jZWxsYXRp/b24tcG9saWN5LWZl/YXR1cmVkLWltYWdl/LmpwZw" alt="Product Photo" style="max-width: 100%; height: auto;">
            </div>
            </div>
        `
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed to send cancellation email" });
        } else {
          console.log('Cancellation Email sent: ' + info.response);
          // Delete the order from the database
          await Order.findByIdAndDelete(orderId);
          res.status(200).json({ message: "Order cancelled successfully and email sent" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  


export default router;

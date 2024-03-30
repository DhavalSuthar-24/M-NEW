import express from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model.js"; // Import the Order model
import { Product } from "../models/product.model.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
const stripe = new Stripe('sk_test_51OySR3SH9ySesKUUn99kqLkKB5FFsLGufFhCl9ZjHbThbDjFrSwLt6y4hjqk6rQ8eM4wVMk45RcObiCf2qiRRTdZ00qQic1COz');

// Default customer address
const defaultCustomerAddress = {
  line1: "123 Default Street",
  city: "Default City",
  postal_code: "12345",
  country: "IN"
};

// Create a checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body; // Assuming products is an array of items

  try {
    // Create line items for the checkout session
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          images: [product.image],
        },
        unit_amount: product.price * 100, // Amount in cents
      },
      quantity: product.quantity,
    }));

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/payment-failed',
      billing_address_collection: 'required', // Prompt Stripe to collect billing address
      // shipping_address_collection: {
      //   allowed_countries: [''], // Allow shipping to India
      // },
    });

    res.status(200).json({ id: session.id }); // Send the session ID in the response
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});


// Handle payment success
router.post("/payment-success", verifyUser, async (req, res) => {
  try {
    const orderData = req.body.order; // Assuming you receive the order details in the request body

    // Create a new order record in the Order model
    const newOrder = new Order({
      userId: orderData.userId,
      productId: orderData.productId,
      quantity: orderData.quantity,
      totalPrice: orderData.totalPrice,
      paymentStatus: 'completed', // Assuming the payment status is marked as completed
      // Add more fields as needed, such as shipping address, payment method, etc.
    });

    // Save the new order to the database
    await newOrder.save();

    // Update the product quantity in the Product model
    const product = await Product.findById(orderData.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    product.quantity -= orderData.quantity;
    await product.save();

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

export default router;

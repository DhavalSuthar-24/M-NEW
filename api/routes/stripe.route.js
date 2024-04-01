import express from "express";
import mongoose from 'mongoose';
import Stripe from "stripe";
import { Order } from "../models/order.model.js"; // Import the Order model
import { Product } from "../models/product.model.js";

const router = express.Router();
const stripe = new Stripe('sk_test_51OySR3SH9ySesKUUn99kqLkKB5FFsLGufFhCl9ZjHbThbDjFrSwLt6y4hjqk6rQ8eM4wVMk45RcObiCf2qiRRTdZ00qQic1COz');

// Connect to MongoDB


// Create a checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { products, userId, username } = req.body;
  const customer = await stripe.customers.create({
    metadata: {
      userId:userId,
      cart: JSON.stringify(products),
    },
  });

  try {


    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          images: [product.image],
          metadata:{
            id: product._id

          }
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/api/stripe/payment-success',
      cancel_url: 'http://localhost:3000/payment-failed',
      billing_address_collection: 'required',
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      }
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Handle payment success
router.post("/payment-success", async (req, res) => {
  try {
    const { payment_intent, metadata } = req.body;
    const { userId, username, products } = metadata;
    const parsedProducts = JSON.parse(products);

    const newOrder = new Order({
      userId: userId,
      username: username,
      products: parsedProducts.map(product => ({
        productId: product.id, // Adjust according to your model schema
        quantity: product.quantity,
      })),
      paymentIntent: payment_intent,
      payment_status: 'completed',
    });

    await newOrder.save();

    for (const product of parsedProducts) {
      const existingProduct = await Product.findById(product.id);

      if (!existingProduct) {
        throw new Error(`Product with ID ${product.id} not found`);
      }

      existingProduct.quantity -= product.quantity;
      await existingProduct.save();
    }

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Stripe webhook
// Stripe webhook
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_b7193d8be75282424d9dc46ab21ad1f5c7b9fb834eed50c7c651ff152a40dc95"; // Replace with your webhook secret

  let event;

  try {
    const rawBody = req.rawBody; // Assuming you have middleware to populate req.rawBody

    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customer = await stripe.customers.retrieve(session.customer);

    await createOrder(customer, session);
  }

  res.sendStatus(200);
});



// Function to create order
const createOrder = async (customer, session) => {
  const parsedProducts = JSON.parse(customer.metadata.cart);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    products: parsedProducts.map(product => ({
      productId: product.productId, // Assuming product.productId corresponds to the ID in your schema
      quantity: product.quantity,
    })),
    subtotal: data.amount_subtotal, // Assuming data contains the necessary information
    total: data.amount_total, // Assuming data contains the necessary information
    shipping: data.customer_details, // Assuming data contains the necessary information
    payment_status: data.payment_status, // Assuming data contains the necessary information
  });
  

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

export default router;

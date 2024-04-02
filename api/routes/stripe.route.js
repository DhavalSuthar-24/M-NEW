import express from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model.js"; 
import { Product } from "../models/product.model.js";

const router = express.Router();
const stripe = new Stripe('sk_test_51OySR3SH9ySesKUUn99kqLkKB5FFsLGufFhCl9ZjHbThbDjFrSwLt6y4hjqk6rQ8eM4wVMk45RcObiCf2qiRRTdZ00qQic1COz');

router.post("/create-checkout-session", async (req, res) => {
  const { products, userId, username } = req.body;
  const customer = await stripe.customers.create({
    metadata: {
      userId: userId,
      cart: JSON.stringify(products.map(product => ({ productId: product._id, quantity: product.quantity }))),
    }
    ,
  });

  try {
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          images: [product.image],
          metadata: {
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

const endpointSecret = "whsec_b7193d8be75282424d9dc46ab21ad1f5c7b9fb834eed50c7c651ff152a40dc95";

router.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // ... (existing code to extract order data)

      // Create new Order document
      const order = new Order({
        userId,
        products,
        subtotal,
        total,
        shipping,
        payment_status
      });

      try {
        // Wait for the order to be saved before sending response
        await order.save();
        console.log("Order saved successfully");
      } catch (error) {
        console.error("Error saving order:", error);
        // Consider sending an error response here (optional)
      }
      break;
    // Add default case to handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Send response after order is saved (or error handled)
  response.send();
});

export default router;

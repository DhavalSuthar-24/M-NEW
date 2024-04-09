// import express from "express";
// import Stripe from "stripe";
// import { Order } from "../models/order.model.js";
// import { Product } from "../models/product.model.js";
// import { decreaseProductQuantity } from '../utils/decreaseQ.js';
// import User from '../models/user.model.js';

// const router = express.Router();
// const stripe = new Stripe('sk_test_51OySR3SH9ySesKUUn99kqLkKB5FFsLGufFhCl9ZjHbThbDjFrSwLt6y4hjqk6rQ8eM4wVMk45RcObiCf2qiRRTdZ00qQic1COz');

// const getUserData = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     return user;
//   } catch (error) {
//     console.error("Error retrieving user data:", error);
//     throw new Error("Failed to retrieve user data");
//   }
// };

// router.post("/create-checkout-session", async (req, res) => {
//   const { products, userId, username } = req.body;
//   const user = await getUserData(userId);
//   const userEmail = user.email;
//   // Create customer and attach metadata
//   const customer = await stripe.customers.create({
//     email: userEmail,
//     metadata: {
//       userId: userId,
//       cart: JSON.stringify(products.map(product => ({ productId: product._id, quantity: product.quantity }))),
//     }
//   });

//   try {
//     // Create line items for checkout session
//     const lineItems = products.map(product => ({
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: product.title,
//           images: [product.image],
//           metadata: {
//             id: product._id
//           }
//         },
//         unit_amount: product.price * 100,
//       },
//       quantity: product.quantity,
//     }));

//     // Create a checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'https://m-new.onrender.com/payment-success',
//       cancel_url: 'https://m-new.onrender.com/payment-failure',
//       billing_address_collection: 'required',
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: 0,
//               currency: "usd",
//             },
//             display_name: "Free shipping",
//             delivery_estimate: {
//               minimum: { unit: "business_day", value: 5 },
//               maximum: { unit: "business_day", value: 7 },
//             },
//           },
//         },
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: 1500,
//               currency: "usd",
//             },
//             display_name: "Next day air",
//             delivery_estimate: {
//               minimum: { unit: "business_day", value: 1 },
//               maximum: { unit: "business_day", value: 1 },
//             },
//           },
//         },
//       ],
//       phone_number_collection: {
//         enabled: true,
//       },
//       customer: customer.id
//     });

//     res.status(200).json({ id: session.id });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// });

// router.post("/checkout-success", async (req, res) => {
//   const data = req.body;
//   try {
//     const customer = await stripe.customers.retrieve(data.customer);
//     await createOrder(customer, data);
//     await decreaseProductQuantity(JSON.parse(customer.metadata.cart));
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error processing checkout success:", error);
//     res.sendStatus(500);
//   }
// });

// const createOrder = async (customer, data) => {
//   const Items = JSON.parse(customer.metadata.cart);
//   try {
//     // Create the order object
//     const newOrder = new Order({
//       userId: customer.metadata.userId,
//       customerId: data.customer,
//       paymentIntentId: data.payment_intent,
//       products: Items,
//       subtotal: data.amount_subtotal,
//       total: data.amount_total,
//       shipping: data.customer_details,
//       payment_status: data.payment_status,
//       receiptUrl: data.receipt_url ? data.receipt_url : null
//     });

//     // Save the order
//     const savedOrder = await newOrder.save();
//     console.log("Processed Order:", savedOrder);

//     // Update the user's orders field with the new order's ObjectId
//     await User.findByIdAndUpdate(customer.metadata.userId, {
//       $push: { orders: savedOrder._id }
//     });
//   } catch (err) {
//     console.error("Error creating order:", err);
//   }
// };

// export default router;

















































































































































































































































import express from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model.js"; 
import { Product } from "../models/product.model.js";
import {decreaseProductQuantity} from '../utils/decreaseQ.js'
import User from '../models/user.model.js';

const router = express.Router();
const stripe = new Stripe('sk_test_51OySR3SH9ySesKUUn99kqLkKB5FFsLGufFhCl9ZjHbThbDjFrSwLt6y4hjqk6rQ8eM4wVMk45RcObiCf2qiRRTdZ00qQic1COz');





const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    throw new Error("Failed to retrieve user data");
  }
};




router.post("/create-checkout-session", async (req, res) => {
  const { products, userId, username } = req.body;
  const user = await getUserData(userId);
  const userEmail = user.email;
  // Create customer and attach metadata
  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: {
      userId: userId,
      cart: JSON.stringify(products.map(product => ({ productId: product._id, quantity: product.quantity }))),
    }
  });

  try {
    // Create line items for checkout session
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

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://m-new.onrender.com/payment-success',
      cancel_url: 'https://m-new.onrender.com/payment-failure',
      // customer_email: userEmail,
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
      },
      customer: customer.id
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  try {
    // Create the order object
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: Items,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      payment_status: data.payment_status,
      receiptUrl: data.receipt_url ? data.receipt_url : null// Adding receipt_url to the order
    });

    // Save the order
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);

    // Update the user's orders field with the new order's ObjectId
    await User.findByIdAndUpdate(customer.metadata.userId, {
      $push: { orders: savedOrder._id }
    });
  } catch (err) {
    console.error("Error creating order:", err);
  }
};


const endpointSecret = "whsec_b7193d8be75282424d9dc46ab21ad1f5c7b9fb834eed50c7c651ff152a40dc95";

router.post(
  "/webhook",
  express.raw({ type: '*/*' }),
  async (req, res) => {
    const rawBody = req.rawBody;
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          rawBody, // Pass rawBody instead of req.body
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data);
            // Decrease product quantity
            await decreaseProductQuantity(JSON.parse(customer.metadata.cart));
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);


router.use(express.json())

export default router;
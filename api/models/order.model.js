import mongoose from 'mongoose';
import User from './user.model.js';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    },
    products: [
      { productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
      , quantity: { type: Number, default: 1 },_id:{String} },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
    orderConfirmation:{type:Boolean ,default:false},

  },
  { timestamps: true }
);
orderSchema.pre('remove', async function(next) {
  try {
    // Find the user associated with the order
    const User = mongoose.model('User');
    const user = await User.findOne({ orders: { $in: [this._id] } });

    // Log user and order ID for debugging
    console.log('User:', user);
    console.log('Order ID:', this._id);

    // If user is found, update the orders field by removing the deleted order ID
    if (user) {
      user.orders = user.orders.filter(orderId => orderId.toString() !== this._id.toString());
      await user.save();
      console.log('User orders after removal:', user.orders); // Log user orders after removal
    }

    next(); // Proceed to remove the order
  } catch (error) {
    console.error('Error in pre-remove hook:', error);
    next(error); // Pass any error to the next middleware
  }
});



export const Order = mongoose.model("Order", orderSchema);

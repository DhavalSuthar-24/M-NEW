import mongoose from 'mongoose';

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

export const Order = mongoose.model("Order", orderSchema);

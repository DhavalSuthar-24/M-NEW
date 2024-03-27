import mongoose from "mongoose";

// Define the coupon schema
const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'rupees'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false  // Default value is false indicating the coupon hasn't been used yet
  }
});

// Create the Coupon model
export const Coupon = mongoose.model('Coupon', couponSchema);

// Export the Coupon model

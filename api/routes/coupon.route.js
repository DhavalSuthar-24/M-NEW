import express from "express"
import { verifyUser } from "../utils/verifyUser.js";
import { Coupon } from "../models/coupen.model.js";


const router = express.Router()

router.post("/save",verifyUser, async (req, res) => {
    try {
      // Extract coupon data from request body
      const { couponCode, discountType, discountValue } = req.body;
  
      // Create a new coupon instance
      const newCoupon = new Coupon({
        couponCode,
        discountType,
        discountValue
      });
  
      // Save the new coupon to the database
      const savedCoupon = await newCoupon.save();
  
      // Return the saved coupon in the response
      res.status(201).json(savedCoupon);
    } catch (error) {
      // Handle errors
      console.error("Error saving coupon:", error);
      res.status(500).json({ message: "Failed to save coupon" });
    }
  });

 // Rewrite of /check/:code endpoint to mark the coupon as used

router.get("/check/:code", async (req, res) => {
  const { code } = req.params;

  try {
      // Query the database to find the coupon with the provided code
      const coupon = await Coupon.findOne({ couponCode: code });
    
      // Check if the coupon exists and is valid
      if (!coupon) {
          // Coupon not found
          return res.status(404).json({ message: "Coupon not found" });
      }
      if (coupon.isUsed) {
          // Coupon has already been used
          return res.status(400).json({ message: "Coupon has already been used" });
      }
      if (coupon.expiryDate && coupon.expiryDate < Date.now()) {
          // Coupon has expired
          return res.status(400).json({ message: "Coupon has expired" });
      }
    
      // Coupon is valid, send the coupon object
      return res.status(200).json({ message: "Coupon is valid", coupon });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

// API for changing the isUsed field to true

router.post("/mark-used/:code", async (req, res) => {
  const { code } = req.params;

  try {
      // Query the database to find the coupon with the provided code
      const coupon = await Coupon.findOne({ couponCode: code });

      // Check if the coupon exists
      if (!coupon) {
          // Coupon not found
          return res.status(404).json({ message: "Coupon not found" });
      }

      // Mark the coupon as used
      coupon.isUsed = true;
      await coupon.save();

      // Coupon has been successfully marked as used
      return res.status(200).json({ message: "Coupon successfully marked as used", coupon });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

  

  
  // Export the router
  export default router;
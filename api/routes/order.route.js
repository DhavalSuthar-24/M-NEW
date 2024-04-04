import express from 'express';
import { Order } from '../models/order.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Route to get order by orderId
router.get("/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ message: "Invalid orderId format" });
      }
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

export default router;

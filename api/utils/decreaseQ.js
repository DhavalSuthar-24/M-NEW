import {Product} from "../models/product.model.js";
export const decreaseProductQuantity = async (orderProducts) => {
    try {
      for (const orderProduct of orderProducts) {
        const product = await Product.findById(orderProduct.productId);
  
        if (!product) {
          throw new Error(`Product with ID ${orderProduct.productId} not found`);
        }
  
        product.quantity -= orderProduct.quantity;
  
        if (product.quantity < 0) {
          throw new Error(`Insufficient quantity for product with ID ${orderProduct.productId}`);
        }
  
        await product.save();
  
        console.log(`Quantity decreased for product with ID ${orderProduct.productId}`);
      }
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
      throw error;
    }
  };

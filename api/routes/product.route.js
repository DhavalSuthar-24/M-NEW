import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { addProduct,getProducts,getProduct } from '../controllers/product.controller.js'
import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'

const router = express.Router()

router.post("/add",verifyUser,addProduct)
router.get("/getproducts", getProducts);
router.get('/getproduct/:id',getProduct);
router.delete('/deleteProduct/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by its ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // Check if the product exists
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/updateProduct/:productId', async (req, res) => {
  const productId = req.params.productId;
  const { title, description, price, quantity } = req.body;

  try {
    // Find the product by its ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      title,
      description,
      price,
      quantity
    }, { new: true });

    // Check if the product exists
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



  
  export default router
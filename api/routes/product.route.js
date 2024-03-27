import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { addProduct,getProducts,getProduct } from '../controllers/product.controller.js'
import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'

const router = express.Router()

router.post("/add",verifyUser,addProduct)
router.get("/getproducts", getProducts);
router.get('/getproduct/:id',getProduct);

  
  export default router
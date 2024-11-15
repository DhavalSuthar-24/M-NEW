import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import productRoute from "./routes/product.route.js";
import stripeRoute from "./routes/stripe.route.js";
import coupenRoute from "./routes/coupon.route.js";
import orderRoute from "./routes/order.route.js";
import niftyRoute from "./routes/nifty.route.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({limit:'10mb'}));

app.use(cookieParser());

// Static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));


app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
// Routes
app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use("/api/comment", commentRoute);
app.use("/api/product",productRoute);
app.use('/api/stripe',stripeRoute);
app.use('/api/coupon',coupenRoute);
app.use('/api/order',orderRoute);
app.use('/api/market',niftyRoute)
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'client','dist','index.html'));

})
// Error handling middleware
app.use((err, req, res, next) => {
    const statuscode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statuscode).json({ success: false, statuscode, message });
});


mongoose.connect(process.env.MONGOURI  ).then(() => {
    console.log("Connected to database");

}).catch((err) => {
    console.error("Database connection error:", err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // console.log(process.env.MONGOURI);
    console.log(`Server is listening on port ${PORT}`);
});

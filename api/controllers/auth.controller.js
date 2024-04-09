import User from "../models/user.model.js";
import bcyrptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";
export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password || email==="" || password==="" || username==="") {
        next(errorHandler(400,"All fields are required"));
        return;
    }

    // Password regex pattern
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
        next(errorHandler(400,"Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long"));
        return;
    }

    const hashedpassword = await bcyrptjs.hashSync(password,12);

    const newUser = new User({username,email,password:hashedpassword})
    try {
        const user = await newUser.save();
        res.status(201).json({message:"User created successfully",user});
    } catch (error) {
        next(error);
    }
};

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email ||!password || email==="" || password===""){
        next(errorHandler(400,"All fields are required"));
        return;
    }

    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    // if (!passwordRegex.test(password)) {
    //     next(errorHandler(400,"Invalid password format"));
    //     return;
    // }

    try {
        const validuser = await User.findOne({email});
        if(!validuser){
            next(errorHandler(404,"User not found"));
            return;
        }
        const isMatch = await bcyrptjs.compareSync(password,validuser.password);
        if(!isMatch){
            next(errorHandler(401,"Invalid password"));
            return;
        }
        const token = jwt.sign({_id:validuser._id,isAdmin:validuser.isAdmin},process.env.JWT_SECRET||'leo7');
        const {password:pass,...rest}= validuser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly:true
        }).json(rest);
    } catch (error) {
        next(error);
    }
};

 

export const google = async (req, res, next) => {
   const { email, name, photoURL } = req.body;
   try {
       const user = await User.findOne({ email });
       if (user) {
           // User already exists
           const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'leo7');
           const { password, ...rest } = user._doc;
           res.status(200).cookie('access_token', token, {
               httpOnly: true
           }).json(rest);
       } else {
           // Create new user
           const generatedPassword = Math.random().toString(36).slice(-8);
           const hashedPassword = await bcyrptjs.hashSync(generatedPassword, 12);
           const newUser = new User({
               email,
               username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
               password: hashedPassword,
               profilepic: photoURL
           });
           await newUser.save();
           const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET || 'leo7');
           const { password: pass, ...rest } = newUser._doc;
           res.status(200).cookie('access_token', token, {
               httpOnly: true
           }).json(rest);
       }
   } catch (error) {
       next(error);
   }
};




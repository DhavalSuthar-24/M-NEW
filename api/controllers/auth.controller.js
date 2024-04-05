import User from "../models/user.model.js";
import bcyrptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";
export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password || email==="" || password==="" || username===""){

        next(errorHandler(400,"all fields are required"))
    }

    const hashedpassword =  await bcyrptjs.hashSync(password,12);

    const newUser = new User({username,email,password:hashedpassword})
 await newUser.save().then((user)=>{
     res.status(201).json({message:"User created successfully",user})
 }).catch((e)=>{
    next(e)
 })
} 

export const signin = async(req,res,next)=>{
 const {email,password} = req.body;
 if(!email ||!password || email==="" || password===""){

    next(errorHandler(400,"all fields are required"))
 }
 try{
  const validuser = await User.findOne({email})
  if(!validuser){
    return next(errorHandler(404,"user not found"))
  }
  const isMatch = await bcyrptjs.compareSync(password,validuser.password)
  if(!isMatch){
     return next(errorHandler(401,"invalid password"))
  }
  const token = jwt.sign({_id:validuser._id,isAdmin:validuser.isAdmin},process.env.JWT_SECRET||'leo7')
  const {password:pass,...rest}= validuser._doc

  
  res.status(200).cookie('access_token',token,{
    httpOnly:true
  }).json(rest)



 }
 catch(e){
    next(e)
 }}

 export const google = async (req, res, next) => {
   const { email, name, photoURl } = req.body;
   try {
       const user = await User.findOne({ email });
       if (user) {
           // User already exists
           const token = jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET ||'leo7');
           const { password, ...rest } = user._doc;
           res.status(200).cookie('access_token', token, {
               httpOnly: true
           }).json(rest);
       } else {
           // Create new user
           const generatedPassword = Math.random().toString(36).slice(-8);
           const hashedpassword = await bcryptjs.hashSync(generatedPassword, 12);
           const newUser = new User({
               email,
               username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
               password: hashedpassword,
               profilepic: photoURl
           });
           await newUser.save();
           const token = jwt.sign({ id: newUser._id ,isAdmin:newUser.isAdmin}, process.env.JWT_SECRET);
           const { password: pass, ...rest } = newUser._doc;
           res.status(200).cookie('access_token', token, {
               httpOnly: true
           }).json(rest);
       }
   } catch (e) {
       next(e);
   }
};



import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const updateUser = async (req, res, next) => {
    console.log(req.user._id,req.params.userId)
    if (req.user._id !== req.params.userId) {
      
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 12);
    }
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, 'Username must be between 7 and 20 characters')
        );
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, 'Username can only contain letters and numbers')
        );
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilepic: req.body.profilepic,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('User has been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const signOut = async (req, res, next) => {
   try{
    res.clearCookie('access_token');
    res.status(200).json("user succesfully signed out");
}catch(e){
    next(e)
}
  }

  export const getUsers = async (req,res,next)=>{
    if(!req.user.isAdmin){
      return next(errorHandler(400,"you are not allowed to get users")
      )
    }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc'? 1 : -1;

      const users = await User.find()
      .sort({ createdAt: sortDirection})
      .skip(startIndex)
      .limit(limit)

      const userWithoutpassword = users.map((user)=>{
        const { password,...rest } = user._doc;
        return rest;
      })
      
      const totalUsers= await User.countDocuments()
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
        users:userWithoutpassword,
        totalUsers,
        lastMonthUsers
      })
    } catch (error) {
      next(error);
    }
  }

  export const getUser = async(req,res,next)=>{
    try{
      const user = await User.findById(req.params.userId);
      if(!user){
        return next(errorHandler(404,"user not found"))
      }
      const { password,...rest } = user._doc;

      res.status(200).json(user)
    }catch(e){
      next(e)
    }


  }

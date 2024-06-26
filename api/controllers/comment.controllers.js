import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";
export const createComment = async(req,res,next)=>{
    try{
         const {content,postId,userId} = req.body;
         if(userId !== req.user._id){
             return next(errorHandler(400,"you are not allowed to comment on this post"))
         }
         const newComment = new Comment({
             content,
             postId,
             userId
         })
         await newComment.save();

         res.status(200).json(newComment)
         

    }catch(e){
        next(e)
    }
}

export const createReview = async(req,res,next)=>{
  try{
       const {content,postId,userId,stars} = req.body;
       if(userId !== req.user._id){
           return next(errorHandler(400,"you are not allowed to give review "))
       }
       const newComment = new Comment({
           content,
           postId,
           userId,
           stars

       })
       await newComment.save();

       res.status(200).json(newComment)
       

  }catch(e){
      next(e)
  }
}

export const getPostComments = async(req,res,next)=>{
    try {
        const comments = await  Comment.find({postId:req.params.postId}).sort(
            {
                createdAt: -1,
            }
        )
        res.status(200).json(comments)
        
    } catch (error) {
        
        next(error);
    }

}
export const likeComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      const userIndex = comment.likes.indexOf(req.user._id);
      if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user._id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };
  
  export const editComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(
          errorHandler(403, 'You are not allowed to edit this comment')
        );
      }
  
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          content: req.body.content,
        },
        { new: true }
      );
      res.status(200).json(editedComment);
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(
          errorHandler(403, 'You are not allowed to delete this comment')
        );
      }
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json('Comment has been deleted');
    } catch (error) {
      next(error);
    }
  };
  
  export const getcomments = async (req, res, next) => {
   
    try {
        console.log(req.user)
      // Check if the user is an admin
      if ( !req.user.isAdmin) {
        // If not an admin, return a 403 Forbidden error
        return res.status(403).json({ error: 'You are not allowed to get all comments' });
      }
  
      // Parse query parameters for pagination and sorting
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
  
      // Query the database for comments, applying pagination and sorting
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      // Count the total number of comments
      const totalComments = await Comment.countDocuments();
  
      // Calculate the number of comments from the last month
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
  
      // Send the response with comments, totalComments, and lastMonthComments
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };
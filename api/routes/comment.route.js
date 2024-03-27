import express from 'express';
import { verifyUser } from '../utils/verifyUser.js'
const router =express.Router();
import { createComment,getPostComments , likeComment,editComment,deleteComment,getcomments} from '../controllers/comment.controllers.js';

router.post('/create',verifyUser,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',verifyUser,likeComment);
router.put('/editComment/:commentId',verifyUser,editComment);
router.delete('/deleteComment/:commentId',verifyUser,deleteComment);    
router.get('/getcomments',verifyUser,getcomments)

export default router




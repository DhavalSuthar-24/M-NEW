import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/post.controllers.js";
import { Post } from "../models/post.model.js";
// import getRandomInshortsNews from "../controllers/inshort.controllers.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getposts", getPosts);
router.delete('/deletepost/:postId/:userId', verifyUser, deletePost);
router.put('/updatepost/:postId/:userId', verifyUser, updatePost);
router.post('/addview/:postId', async (req, res) => {
    const { userId } = req.body;
    const { postId } = req.params;
  
    try {
      const post = await Post.findById(postId);
  
      // Check if the user has already viewed the post
      if (!post.views.includes(userId)) {
        post.views.push(userId);
        post.vCounts = post.views.length; // Increment vCount based on views array length
        await post.save();
        
        res.status(200).send({ message: 'View added successfully' });
      } else {
        res.status(400).send({ error: 'User has already viewed this post' });
      }
    } catch (error) {
      console.error('Error adding view:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

// router.get('/random-news', (req, res) => {
//     getRandomInshortsNews(function(result) {
//         res.json(result);
//     });
// });

export default router;

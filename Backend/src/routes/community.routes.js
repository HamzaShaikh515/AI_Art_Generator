import express from 'express';
import {
    createPost,
    getAllPosts,
    likePost,
    dislikePost,
    addComment,
    getPostById,
} from '../controllers/community.controllers.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a new post
router.post('/posts/create',authenticateUser, createPost);

// Route to get all posts
router.get('/posts', getAllPosts);

// Route to get a single post by ID
router.get('/posts/:id', getPostById);

// Route to like a post
router.post('/posts/:id/like', authenticateUser, likePost);

// Route to dislike a post
router.post('/posts/:id/dislike', authenticateUser, dislikePost);

// Route to add a comment on a post
router.post('/posts/:postId/comments', authenticateUser, addComment);
           
export default router;

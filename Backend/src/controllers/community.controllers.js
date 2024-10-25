import express from "express";
// Correct spelling of 'utilities'
import Post from "../models/post.models.js";
import { User } from "../models/user.models.js";

// Controller to create a new post
// const createPost = async (req, res) => {
//   try {
//     const { imageUrl, description } = req.body;

//     // Assuming the token is already verified and stored in req.user
//     const userId = req.user._id;
//     const username = req.user.username;

//     // Check if required fields are present
//     if (!imageUrl || !description || !userId) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     // Create a new post
//     const newPost = new Post({
//       userId,  // Save the user ID from the token
//       username, // Save the username from the token
//       imageUrl,
//       description,
//     });

//     await newPost.save(); // Save the post to the database

//     return res.status(201).json({ message: 'Post created successfully', post: newPost });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


const createPost = async (req, res) => {
  try {
    const { imageUrl, description } = req.body;

    // Assuming the token is already verified and stored in req.user
    const userId = req.user._id; // User ID from the token
    const username = req.user.username; // Username from the token

    // Check if required fields are present
    if (!imageUrl || !userId) { // Optional: you can keep description if required
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Create a new post
    const newPost = new Post({
      userId,  // Save the user ID from the token
      username, // Save the username from the token
      imageUrl,
      description, // Include description in the post object
    });

    await newPost.save(); // Save the post to the database

    return res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Controller to fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId").exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a specific post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId").exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id; // Extract user ID from the authenticated token
  const { commentText } = req.body;

  // Validate the comment text
  if (!commentText || commentText.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
  }

  try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const comment = { userId, commentText };
      post.comments.push(comment);
      await post.save();

      console.log('Updated post comments:', post.comments); // Log the updated comments

      res.status(201).json({ message: 'Comment added', comments: post.comments });
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Error adding comment', error });
  }
};



// Like Post
const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; // Assuming you extract the user ID from the authenticated token

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user has already disliked the post
      if (post.dislikes.includes(userId)) {
          // Remove the dislike
          post.dislikes = post.dislikes.filter(id => id !== userId);
      }

      // Check if user has already liked the post
      if (post.likes.includes(userId)) {
          // Optionally, remove the like
          post.likes = post.likes.filter(id => id !== userId);
      } else {
          post.likes.push(userId); // Add the like
      }

      await post.save();
      return res.json({ likes: post.likes }); // Return the updated likes array
  } catch (error) {
      console.error('Error liking the post:', error);
      return res.status(500).json({ message: 'Could not like the post.' });
  }
};

// Dislike Post
const dislikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; // Assuming you extract the user ID from the authenticated token

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user has already liked the post
      if (post.likes.includes(userId)) {
          // Remove the like
          post.likes = post.likes.filter(id => id !== userId);
      }

      // Check if user has already disliked the post
      if (post.dislikes.includes(userId)) {
          // Optionally, remove the dislike
          post.dislikes = post.dislikes.filter(id => id !== userId);
      } else {
          post.dislikes.push(userId); // Add the dislike
      }

      await post.save();
      return res.json({ dislikes: post.dislikes }); // Return the updated dislikes array
  } catch (error) {
      console.error('Error disliking the post:', error);
      return res.status(500).json({ message: 'Could not dislike the post.' });
  }
};


// Delete a Post
const deletePost = async (req, res) => {
  const { postId } = req.params; // Get postId from the URL parameters
  const userId = req.user._id; // Assuming you have middleware that sets req.user

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this post",
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

export {
  getAllPosts,
  getPostById,
  createPost,
  addComment,
  likePost,
  deletePost,
  dislikePost,
};

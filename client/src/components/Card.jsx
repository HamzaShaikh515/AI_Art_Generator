import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Card = ({ 
  postId, 
  imageUrl, 
  prompt, 
  likes = [], 
  dislikes = [], 
  comments = [], 
  onLike, 
  onDislike, 
  onCommentSubmit, 
  commentText, 
  setCommentText 
}) => {
  const [userLikes, setUserLikes] = useState(false);
  const [userDislikes, setUserDislikes] = useState(false);
  const [error, setError] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [dislikesCount, setDislikesCount] = useState(dislikes.length);

  const token = localStorage.getItem('accessToken');
  let userId;

  // Decode token and extract user ID
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken._id; // Adjust this line if the key is different
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    if (userId) {
      setUserLikes(likes.includes(userId));
      setUserDislikes(dislikes.includes(userId));
    }
  }, [likes, dislikes, userId]);

  const handleLike = async () => {
    if (!userId) {
      setError("You must be logged in to like a post.");
      return;
    }
    if (userLikes) return;

    try {
      await onLike(postId);
      setUserLikes(true);
      setLikesCount((prev) => prev + 1);
      if (userDislikes) {
        setUserDislikes(false);
        setDislikesCount((prev) => prev - 1);
      }
      setError('');
    } catch (error) {
      console.error("Error liking the post:", error);
      setError("Error liking the post. Please try again.");
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      setError("You must be logged in to dislike a post.");
      return;
    }
    if (userDislikes) return;

    try {
      await onDislike(postId);
      setUserDislikes(true);
      setDislikesCount((prev) => prev + 1);
      if (userLikes) {
        setUserLikes(false);
        setLikesCount((prev) => prev - 1);
      }
      setError('');
    } catch (error) {
      setError("Error disliking the post. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    if (!userId) {
      setError("You must be logged in to comment on a post.");
      return;
    }

    try {
      const newComment = await onCommentSubmit(postId, { text: commentText });
      setCommentList((prev) => [...prev, newComment]); // Update comment list with the new comment
      setCommentText(''); // Clear input after submission
      setError('');
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Could not comment on the post. Please try again.");
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4">
      <img src={imageUrl} alt={prompt} className="w-full object-cover" />
      <div className="p-4">
        <p className="text-gray-700 text-sm">{prompt}</p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-2 flex justify-between items-center">
          <button onClick={handleLike} className="flex items-center" disabled={userLikes}>
            <span>👍 {likesCount}</span>
          </button>
          <button onClick={handleDislike} className="flex items-center" disabled={userDislikes}>
            <span>👎 {dislikesCount}</span>
          </button>
          <span>💬 {commentList.length}</span>
        </div>
        <div className="mt-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="border rounded px-2 py-1 w-full"
          />
          <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-1 rounded">
            Comment
          </button>
        </div>
        <div className="mt-2">
          {commentList.length >= 2 ? (
            commentList.slice(-3).map((comment, index) => (
              comment && comment.text ? (
                <p key={comment._id || index} className="text-gray-600 text-sm">{comment.text}</p>
              ) : (
                <p key={index} className="text-gray-600 text-sm">Comment not available</p>
              )
            ))
          ) : (
            <p className="text-gray-600 text-sm">Not enough comments to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

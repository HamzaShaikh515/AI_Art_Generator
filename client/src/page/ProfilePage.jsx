import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { userId } = useParams(); // Extract userId from URL parameters
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]); // State to hold user's posts
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Adjust this to your token storage method
      console.log("Token being sent:", token); // Debug token

      // Check if token is available
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Construct the URL based on whether userId is present or not
      const url = userId
        ? `http://localhost:8080/api/v1/users/profile/${userId}`
        : `http://localhost:8080/api/v1/users/profile`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const { success, user, posts } = data; // Destructure the response

      if (!success) {
        throw new Error(data.message || 'Failed to fetch profile details');
      }

      setProfile(user); // Assuming 'user' is the property containing user details
      setPosts(posts); // Assuming 'posts' contains the user's posts
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [userId]); // Fetch profile again if userId changes

  if (loading) {
    return <div className="text-center text-gray-600">Loading profile...</div>; // Loading state
  }

  if (error) {
    return <div className="text-center text-red-600">Error fetching profile: {error}</div>;
  }

  return (
    <motion.div
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10"
      initial={{ opacity: 0, y: -50 }} // Initial state
      animate={{ opacity: 1, y: 0 }} // Animate to this state
      transition={{ duration: 0.5 }} // Transition duration
    >
      {profile ? (
        <>
          <h1 className="text-3xl font-bold text-teal-600">{profile.username}</h1>
          <p className="text-gray-500">User ID: {profile._id}</p>
          <h2 className="text-2xl font-semibold mt-4 text-teal-500">User Posts</h2>
          {posts.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {posts.map(post => (
                <motion.li
                  key={post._id}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }} // Initial state for each post
                  animate={{ opacity: 1, scale: 1 }} // Animate to this state
                  transition={{ duration: 0.3 }}
                >
                  <img src={post.imageUrl} alt={post.description} className="max-w-full h-auto rounded-md" />
                  <p className="mt-2 text-lg">{post.description}</p>
                  <p className="text-sm text-gray-500">Likes: {post.likes.length}, Dislikes: {post.dislikes.length}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts available.</p>
          )}
        </>
      ) : (
        <p className="text-gray-500">No profile found.</p> // Fallback message if no profile
      )}
    </motion.div>
  );
};

export default ProfilePage;

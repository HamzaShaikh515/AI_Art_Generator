// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from '../components/Card';

// const CommunityPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState('');
//   const [commentText, setCommentText] = useState({}); // State for comment input per post

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/v1/community/posts');
//         if (Array.isArray(response.data)) {
//           const filteredPosts = response.data.filter(post => post.imageUrl);
//           setPosts(filteredPosts);
//         } else {
//           console.error('Expected an array but got', response.data);
//           setPosts([]);
//         }
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//         setError('Error fetching posts. Please try again.');
//         setPosts([]);
//       }
//     };

//     fetchPosts();
//   }, []);

//   // Like a post
//   const handleLike = async (postId) => {
//     const token = localStorage.getItem('accessToken');

//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/v1/community/posts/${postId}/like`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, likes: response.data.likes } : post
//         )
//       );
//     } catch (error) {
//       console.error('Error liking the post:', error);
//       setError('Could not like the post. Please try again.');
//     }
//   };

//   // Dislike a post
//   const handleDislike = async (postId) => {
//     const token = localStorage.getItem('accessToken');

//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/v1/community/posts/${postId}/dislike`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, dislikes: response.data.dislikes } : post
//         )
//       );
//     } catch (error) {
//       console.error('Error disliking the post:', error);
//       setError('Could not dislike the post. Please try again.');
//     }
//   };

//   // Comment on a post
//   const handleComment = async (postId) => {
//     const token = localStorage.getItem('accessToken');

//     if (!commentText[postId]?.trim()) {
//       setError('Comment cannot be empty.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/v1/community/posts/${postId}/comments`,
//         { commentText: commentText[postId] }, // Use commentText field from body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, comments: response.data.comments } : post
//         )
//       );

//       // Clear the comment input for this post after submission
//       setCommentText((prev) => ({ ...prev, [postId]: '' }));
//       setError(''); // Clear error if submission is successful
//     } catch (error) {
//       console.error('Error commenting on the post:', error);
//       setError('Could not comment on the post. Please try again.');
//     }
//   };

//   return (
//     <div className="community-page">
//       <style>
//         {`
//           .community-page {
//             max-width: 800px;
//             margin: 0 auto;
//             background-color: #f9f9f9; /* Light gray background */
//             border-radius: 8px;
//             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//             padding: 20px;
//           }

//           .card {
//             background-color: #ffffff; /* White card background */
//             border-radius: 8px;
//             margin-bottom: 16px;
//             padding: 16px;
//             box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
//             transition: transform 0.2s;
//           }

//           .card:hover {
//             transform: translateY(-2px); /* Slight hover effect */
//           }

//           .card img {
//             width: 100%; /* Make images responsive */
//             border-radius: 4px;
//           }

//           .card h3 {
//             color: #008080; /* Teal for titles */
//           }

//           .card p {
//             color: #555; /* Dark gray for description */
//           }

//           button {
//             background-color: #008080; /* Teal button background */
//             color: #ffffff; /* White text */
//             border: none;
//             border-radius: 4px;
//             padding: 8px 12px;
//             cursor: pointer;
//             transition: background-color 0.3s;
//           }

//           button:hover {
//             background-color: #005757; /* Darker teal on hover */
//           }

//           .text-red-500 {
//             color: #f56565; /* Red for error messages */
//           }
//         `}
//       </style>

//       {error && <p className="text-red-500">{error}</p>}
//       {posts.length === 0 ? (
//         <p>No posts yet.</p>
//       ) : (
//         posts.map((post) => (
//           <Card
//             key={post._id}
//             postId={post._id}
//             imageUrl={post.imageUrl}
//             prompt={post.description}
//             likes={post.likes || []} // Show all likes for the post
//             dislikes={post.dislikes || []} // Show all dislikes for the post
//             comments={post.comments || []} // Show all comments for the post
//             onLike={() => handleLike(post._id)}
//             onDislike={() => handleDislike(post._id)}
//             commentText={commentText[post._id] || ''} // Pass individual comment text
//             setCommentText={(text) => setCommentText((prev) => ({ ...prev, [post._id]: text }))} // Update specific comment text
//             onCommentSubmit={() => handleComment(post._id)} // Submit the comment
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default CommunityPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { motion } from 'framer-motion';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/community/posts');
        if (Array.isArray(response.data)) {
          const filteredPosts = response.data.filter(post => post.imageUrl);
          setPosts(filteredPosts);
        } else {
          console.error('Expected an array but got', response.data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again.');
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      window.scrollBy(0, 1); // Scroll down by 1 pixel
    }, 30); // Adjust speed by changing the interval duration

    return () => clearInterval(scrollInterval); // Cleanup on component unmount
  }, []);

  const handleLike = async (postId) => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/community/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking the post:', error);
      setError('Could not like the post. Please try again.');
    }
  };

  const handleDislike = async (postId) => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/community/posts/${postId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, dislikes: response.data.dislikes } : post
        )
      );
    } catch (error) {
      console.error('Error disliking the post:', error);
      setError('Could not dislike the post. Please try again.');
    }
  };

  const handleComment = async (postId) => {
    const token = localStorage.getItem('accessToken');

    if (!commentText[postId]?.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/community/posts/${postId}/comments`,
        { commentText: commentText[postId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      setError('');
    } catch (error) {
      console.error('Error commenting on the post:', error);
      setError('Could not comment on the post. Please try again.');
    }
  };

  return (
    <div className="community-page">
      <style>
        {`
          .community-page {
            max-width: 800px;
            margin: 0 auto;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }

          .card {
            background-color: #ffffff;
            border-radius: 8px;
            margin-bottom: 16px;
            padding: 16px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }

          .card:hover {
            transform: translateY(-2px);
          }

          .card img {
            width: 100%;
            border-radius: 4px;
          }

          .card h3 {
            color: #008080;
          }

          .card p {
            color: #555;
          }

          button {
            background-color: #008080;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #005757;
          }

          .text-red-500 {
            color: #f56565;
          }
        `}
      </style>

      {error && <p className="text-red-500">{error}</p>}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <Card
              postId={post._id}
              imageUrl={post.imageUrl}
              prompt={post.description}
              likes={post.likes || []}
              dislikes={post.dislikes || []}
              comments={post.comments || []}
              onLike={() => handleLike(post._id)}
              onDislike={() => handleDislike(post._id)}
              commentText={commentText[post._id] || ''}
              setCommentText={(text) => setCommentText((prev) => ({ ...prev, [post._id]: text }))}
              onCommentSubmit={() => handleComment(post._id)}
            />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CommunityPage;

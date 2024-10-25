import React, { useState } from 'react';
import axios from 'axios';
import * as fabric from 'fabric'; // For image transformations
import { Link } from 'react-router-dom'; // Import Link for navigation

const CreatePost = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [canvas, setCanvas] = useState(null); // Store the fabric canvas object

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/v1/prodia/generate-image', { prompt });
      const generatedImageUrl = response.data.imageUrl;
      setImageUrl(generatedImageUrl);

      // Load the image onto the fabric.js canvas for editing
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Set the crossOrigin attribute
      img.src = generatedImageUrl;
      img.onload = () => {
        const canvasInstance = new fabric.Canvas('canvas');
        const fabricImg = new fabric.Image(img);
        fabricImg.scaleToWidth(500); // Scale the image to fit the canvas
        canvasInstance.add(fabricImg);
        setCanvas(canvasInstance); // Save the canvas object
        setShowUsernameInput(true); // Show username input after image generation
      };
    } catch (error) {
      setError('Error generating image. Please try again.');
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  const shareOnCommunity = async (postData) => {
    const token = localStorage.getItem('accessToken'); // Fetch token
  
    if (!postData.imageUrl || !postData.description || !postData.username) {
      setError('Missing required fields. Please make sure all fields are filled.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/community/posts/create',
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request header
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccessMessage('Post created successfully!');
      console.log("Post created:", response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error creating post.');
    }
  };

  const handleSubmitPost = () => {
    const postData = {
      imageUrl,        // Generated image URL
      description: prompt, // Use prompt as description
      username: userName,  // Username input
    };

    shareOnCommunity(postData);
  };

  const handleResize = (width, height) => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.scaleToWidth(width);
        activeObject.scaleToHeight(height);
        canvas.renderAll();
      }
    }
  };

  const handleRotate = (angle) => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.rotate((activeObject.angle + angle) % 360);
        canvas.renderAll();
      }
    }
  };

  const handleDownload = (format = 'png') => {
    if (canvas) {
      try {
        const dataURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `image.${format}`;
        link.click();
      } catch (error) {
        console.error("Error during image download: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGenerateImage();
  };

  return (
    <div className="max-w-2xl mx-auto p-5 bg-gray-100 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4 text-teal-600">Create Post</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="prompt" className="block text-lg font-medium">Enter a prompt:</label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} transition duration-300`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Generated Image</h3>
          <canvas id="canvas" width="500" height="500" className="border border-gray-300"></canvas>

          <div className="mt-4">
            <label className="block text-lg font-medium">Resize Image</label>
            <button onClick={() => handleResize(300, 300)} className="mr-2 bg-gray-300 p-2 rounded">300x300</button>
            <button onClick={() => handleResize(500, 500)} className="bg-gray-300 p-2 rounded">500x500</button>
          </div>

          <div className="mt-4">
            <label className="block text-lg font-medium">Rotate Image</label>
            <button onClick={() => handleRotate(90)} className="mr-2 bg-gray-300 p-2 rounded">Rotate 90°</button>
            <button onClick={() => handleRotate(180)} className="bg-gray-300 p-2 rounded">Rotate 180°</button>
          </div>

          <div className="mt-4">
            <label className="block text-lg font-medium">Download Image</label>
            <button onClick={() => handleDownload('png')} className="mr-2 bg-teal-600 text-white p-2 rounded">Download PNG</button>
            <button onClick={() => handleDownload('jpeg')} className="mr-2 bg-teal-600 text-white p-2 rounded">Download JPG</button>
            <button onClick={() => handleDownload('svg')} className="mr-2 bg-teal-600 text-white p-2 rounded">Download SVG</button>
            <button onClick={() => handleDownload('gif')} className="bg-teal-600 text-white p-2 rounded">Download GIF</button>
          </div>

          {showUsernameInput && (
            <div className="mt-4">
              <label htmlFor="username" className="block text-lg font-medium">Enter your Username to Share:</label>
              <input
                type="text"
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSubmitPost}
                className="mt-2 w-full py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-semibold transition duration-300"
              >
                Share with Community
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Link to Audio-Based Image Generation */}
      <nav className="text-center mt-5">
        <Link to="/audio-image-gen" className="text-teal-500 hover:underline">
          Try Audio-Based Image Generation
        </Link>
      </nav>
    </div>
  );
};

export default CreatePost;

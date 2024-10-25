import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as fabric from 'fabric';
import { Link, useNavigate } from 'react-router-dom';

const CreatePost = ({ user }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [canvas, setCanvas] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [userName, setUserName] = useState('');
    const [showUsernameInput, setShowUsernameInput] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        }

        const fabricCanvas = new fabric.Canvas('canvas');
        setCanvas(fabricCanvas);

        return () => {
            fabricCanvas.dispose();
        };
    }, [navigate]);

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setError('');
        }
    };

    const handleAudioRecord = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const file = new File([blob], 'recordedAudio.wav', { type: 'audio/wav' });
                setAudioFile(file);
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000);
        } catch (err) {
            console.error('Error during audio recording:', err);
            setError('Unable to record audio. Please check your microphone permissions.');
        }
    };

    const handleGenerateFromAudio = async () => {
        if (!audioFile) {
            setError('Please upload or record an audio file.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const { data: { transcript } } = await axios.post('http://localhost:8080/api/v1/upload-audio/audio-image-gen', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (!transcript) {
                throw new Error("Transcription failed or returned an empty transcript.");
            }

            const { data: { imageUrl: generatedImageUrl } } = await axios.post('http://localhost:8080/api/v1/prodia/generate-image', { prompt: transcript });
            console.log('Generated Image URL:', generatedImageUrl); // Log the image URL

            // Set the imageUrl state to trigger re-render
            setImageUrl(generatedImageUrl);
            
            // Load image onto the Fabric.js canvas
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = generatedImageUrl;

            img.onload = () => {
                const fabricImg = new fabric.Image(img);
                fabricImg.scaleToWidth(500);
                canvas.add(fabricImg);
                canvas.renderAll();
                setShowUsernameInput(true);
            };

            img.onerror = () => {
                console.error('Error loading image:', generatedImageUrl);
                setError('Failed to load the image. Please try again.');
            };
        } catch (error) {
            setError(axios.isAxiosError(error) && error.response?.data.error 
                ? `Error: ${error.response.data.error}` 
                : 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const shareOnCommunity = async () => {
        const token = localStorage.getItem('accessToken');
        
        if (!imageUrl || !userName) {
            setError('Missing required fields. Please make sure all fields are filled.');
            return;
        }

        const postData = {
            imageUrl,
            username: userName,
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/community/posts/create',
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Post created successfully!');
            setImageUrl('');
            setUserName('');
            setShowUsernameInput(false);
        } catch (error) {
            console.error("Error creating post:", error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'Error creating post.');
        }
    };

    const handleDownload = (format = 'png') => {
        if (canvas) {
            const dataURL = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `image.${format}`;
            link.click();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-4">Create Post</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <nav className="text-center my-4">
                <Link to="/create-post" className="text-blue-500 hover:underline">
                    Back to Text-Based Image Generation
                </Link>
            </nav>

            <div className="form-group">
                <label htmlFor="audio" className="block text-lg font-medium">Upload an Audio File:</label>
                <input
                    type="file"
                    id="audio"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="form-group mt-4">
                <label className="block text-lg font-medium">Or Record Audio:</label>
                <button onClick={handleAudioRecord} className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300">
                    Record Audio
                </button>
            </div>

            <button
                type="button"
                onClick={handleGenerateFromAudio}
                disabled={loading}
                className={`w-full mt-4 py-2 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition duration-300`}
            >
                {loading ? 'Generating from Audio...' : 'Generate Image from Audio'}
            </button>

            {imageUrl && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Generated Image</h3>
                    <img src={imageUrl} alt="Generated" className="border border-gray-300" style={{ width: '500px', height: 'auto' }} />
                    
                    <canvas id="canvas" width="500" height="500" className="border border-gray-300" style={{ display: 'none' }}></canvas>

                    <div className="mt-4">
                        <label className="block text-lg font-medium">Download Image</label>
                        <button onClick={() => handleDownload('png')} className="mr-2 bg-blue-600 text-white p-2 rounded">Download PNG</button>
                        <button onClick={() => handleDownload('jpeg')} className="mr-2 bg-blue-600 text-white p-2 rounded">Download JPG</button>
                        <button onClick={() => handleDownload('svg')} className="mr-2 bg-blue-600 text-white p-2 rounded">Download SVG</button>
                        <button onClick={() => handleDownload('gif')} className="bg-blue-600 text-white p-2 rounded">Download GIF</button>
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
                            <button onClick={shareOnCommunity} className="mt-2 w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300">
                                Share on Community
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreatePost;

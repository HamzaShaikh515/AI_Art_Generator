import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', // Keep this as fullName
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(null); // State for messages
  const [messageType, setMessageType] = useState(''); // To control success or error styles
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic client-side validation
    if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users/register', {
        username: formData.username,
        email: formData.email,
        fullname: formData.fullName, // Use 'fullname' (lowercase) here
        password: formData.password,
      });
  
      // Handle successful registration
      localStorage.setItem('token', response.data.token);
      setMessage('Signed Up successfully! Redirecting to home.');
      setMessageType('success');
      setTimeout(() => {
        setMessage(null);
        navigate('/');
      }, 1000);
    } catch (error) {
      // Error handling as before
      if (error.response && error.response.data.message) {
        if (error.response.data.message.includes('User already exists')) {
          setMessage('Username already taken.');
        } else if (error.response.data.message.includes('Email already exists')) {
          setMessage('Email already in use.');
        } else {
          setMessage(error.response.data.message); // Display server error message
        }
      } else {
        setMessage('Signup error. Please try again later.');
      }
      setMessageType('error');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Display message */}
        {message && (
          <div className={`text-center p-3 mb-4 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName" // Ensure this matches the state variable
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

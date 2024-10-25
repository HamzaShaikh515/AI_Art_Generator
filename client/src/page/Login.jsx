import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });

      if (!response.ok) {
        const userData = await response.json();
        const errorMessage = userData.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        return;
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);

      // Call onLogin prop with user data
      onLogin(userData.user);

      navigate('/'); // Navigate to home after successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white py-2 rounded`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user'));
        if (accessToken && user) {
            setIsLoggedIn(true);
            setUsername(user.username);
        }
        // Set margin-top for content based on navbar height
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUsername('');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav id="navbar" className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-teal-600 shadow-lg p-4 flex justify-between items-center z-50">
            <div className="flex items-center">
                <Link to="/" className="text-3xl font-bold text-white hover:none transition duration-300">
                    Image Generator
                </Link>
                <div className="ml-6 flex space-x-4">
                    {isLoggedIn && (
                        <>
                            <Link to="/create-post" className="text-white hover:font-bold hover:text-teal-200 transition duration-300">
                                Create Post
                            </Link>
                            <Link to="/community" className="text-white hover:font-bold hover:text-teal-200 transition duration-300">
                                Community
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div>
                {isLoggedIn ? (
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center bg-white px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
                            <span className="text-teal-600">{username || 'Profile'}</span>
                            <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-1">
                                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300">
                                    View Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/login" className="text-white hover:underline transition duration-300">
                            Login
                        </Link>
                        <Link to="/signup" className="text-white hover:underline transition duration-300">
                            Signup
                        </Link>
                        <Link to="/community" className="text-white hover:underline transition duration-300">
                            Community
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

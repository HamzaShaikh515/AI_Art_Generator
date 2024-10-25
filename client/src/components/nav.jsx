import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, username, handleLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-teal-600 shadow-lg p-4 flex justify-between items-center z-50">
            <div className="flex items-center">
                <Link to="/" className="text-3xl font-bold text-white hover:none transition duration-300">
                    Image Generator
                </Link>
                <div className="ml-6 flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link to="/create-post" className="text-white hover:font-bold hover:text-teal-200 transition duration-300">
                                Create Post
                            </Link>
                            <Link to="/community" className="text-white hover:font-bold hover:text-teal-200 transition duration-300">
                                Community
                            </Link>
                        </>
                    ) : (
                        <Link to="/community" className="text-white hover:font-bold hover:text-teal-200 transition duration-300">
                            Community
                        </Link>
                    )}
                </div>
            </div>
            <div>
                {isLoggedIn ? (
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center bg-white px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
                            <span className="text-teal-600">{username}</span>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-1 z-50">
                                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                                >
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
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
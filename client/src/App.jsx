// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/nav'; // Import the Navbar
// import { Home, CreatePost, SignupPage, LoginPage } from './page';
// import CommunityPage from './page/Communitypage';
// import ProfilePage from './page/ProfilePage';
// import PrivateRoute from './components/PrivateRoute'; // Adjust the path as needed
// import AudioImageGen from "./page/AudioImageGen";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (accessToken && user) {
//       setIsLoggedIn(true);
//       setUsername(user.username);
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setIsLoggedIn(true);
//     setUsername(user.username);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUsername('');
//   };

//   return (
//     <Router>
//       <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} /> {/* Include the Navbar here */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//         <Route path="/signup" element={<SignupPage />} />
        
//         {/* Protect these routes */}
//         <Route path="/audio-image-gen" element={<PrivateRoute element={<AudioImageGen />} />} />
//         <Route path="/create-post" element={<PrivateRoute element={<CreatePost />} />} />
//         <Route path="/community" element={<PrivateRoute element={<CommunityPage />} />} />
        
//         {/* Updated Profile route to accept userId and default to logged-in user */}
//         <Route path="/profile/:userId" element={<PrivateRoute element={<ProfilePage />} />} />
//         <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} /> {/* Optional for current user's profile */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav'; // Import the Navbar
import { Home, CreatePost, SignupPage, LoginPage } from './page';
import CommunityPage from './page/Communitypage';
import ProfilePage from './page/ProfilePage';
import PrivateRoute from './components/PrivateRoute'; // Adjust the path as needed
import AudioImageGen from "./page/AudioImageGen";
import TermsAndConditions from './page/TermsAndConditions';
import PrivacyPolicy from './page/PrivacyPolicy';





const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    if (accessToken && user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} /> {/* Include the Navbar here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Protect these routes */}
        <Route path="/audio-image-gen" element={<PrivateRoute element={<AudioImageGen />} />} />
        <Route path="/create-post" element={<PrivateRoute element={<CreatePost />} />} />
        <Route path="/community" element={<PrivateRoute element={<CommunityPage />} />} />
        
        {/* Updated Profile route to accept userId and default to logged-in user */}
        <Route path="/profile/:userId" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} /> {/* Optional for current user's profile */}

      </Routes>
    </Router>
  );
};

export default App;
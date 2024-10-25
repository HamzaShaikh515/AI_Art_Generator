

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Home, CreatePost, SignupPage, LoginPage } from './page';
// import CommunityPage from './page/Communitypage';
// import ProfilePage from './page/ProfilePage';
// import PrivateRoute from './components/PrivateRoute'; // Adjust the path as needed
// import AudioImageGen from "./page/AudioImageGen";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
        
//         {/* Protect these routes */}
//         <Route path="/audio-image-gen" element={<PrivateRoute element={<AudioImageGen />} />} />
//         <Route path="/create-post" element={<PrivateRoute element={<CreatePost />} />} />
//         <Route path="/community" element={<PrivateRoute element={<CommunityPage />} />} />
//         <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav' // Import the Navbar
import { Home, CreatePost, SignupPage, LoginPage } from './page';
import CommunityPage from './page/Communitypage';
import ProfilePage from './page/ProfilePage';
import PrivateRoute from './components/PrivateRoute'; // Adjust the path as needed
import AudioImageGen from "./page/AudioImageGen";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Include the Navbar here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
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



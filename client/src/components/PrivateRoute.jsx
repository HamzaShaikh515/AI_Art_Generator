import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isLoggedIn = (localStorage.getItem('accessToken')!=null); // Check if the user is logged in
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

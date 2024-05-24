import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  // Check if access_token is present in localStorage
  const isLoggedIn = localStorage.getItem('access_token') !== null;

  return isLoggedIn ? <Outlet /> : <Navigate to="/authentication/sign-in" />;
};

export default PrivateRoutes;

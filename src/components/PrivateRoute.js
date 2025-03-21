import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;

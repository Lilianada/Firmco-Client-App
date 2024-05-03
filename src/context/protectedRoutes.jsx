import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext';

function ProtectedRoute ({children}) {
  const {user} = useContext(AuthContext);
  if (user === null) {
    return <Navigate to="/" />;
  }
  return children;
}


export default ProtectedRoute;
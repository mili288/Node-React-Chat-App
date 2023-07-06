import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component,  ...rest }) => {
   return(
    localStorage.getItem('token') ? <Outlet /> : <Navigate to='/login' />
   )
  };

export default ProtectedRoute;

{/* <Route {...rest} render={(props) => (
    isAuthenticated
      ? <Component {...props} />
      : <Navigate to='/login' />
)} /> */}

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  roles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
  const role = localStorage.getItem('userRole');
  const usersRole = role ? role : '';

  if (!roles.includes(usersRole)) {
    return <Navigate to="/signin" />;
  }

  return element;
};

export default PrivateRoute;

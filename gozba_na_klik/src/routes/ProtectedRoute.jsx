import React from "react";
import { useUser } from "../components/users/UserContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuth, role } = useUser();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!allowedRolesArray.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

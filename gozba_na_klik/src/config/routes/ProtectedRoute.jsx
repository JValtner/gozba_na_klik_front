import React from "react";
import { useUser } from "../../components/users/UserContext";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuth, role, loading } = useUser();

  // Čekaj dok se autentifikacija učitava
  if (loading) {
    return <Spinner />;
  }

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

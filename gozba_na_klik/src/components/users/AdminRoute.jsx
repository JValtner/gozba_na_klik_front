import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const AdminRoute = ({ children }) => {
  const { isAuth, role } = useUser();

  // Ako korisnik nije prijavljen ili nije admin, preusmeri na početnu stranu
  if (!isAuth || role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children; // Ako jeste admin, prikazi sadrzaj
};

export default AdminRoute;

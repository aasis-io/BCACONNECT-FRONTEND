import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("jwt");

  // If no token, redirect to login page
  if (!jwt) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the children (DashboardLayout etc.)
  return <Outlet />;
};

export default ProtectedRoute;

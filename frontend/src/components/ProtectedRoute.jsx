import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../lib/api";

export function ProtectedRoute({ children, allowedRoles }) {
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && (!auth?.user?.userType || !allowedRoles.includes(auth.user.userType))) {
    return <Navigate to="/" replace />;
  }

  return children;
}

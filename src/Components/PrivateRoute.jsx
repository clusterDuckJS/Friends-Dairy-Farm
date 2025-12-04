import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = useAuth();

  if (user === undefined) return <div>Loading...</div>; // still checking session
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

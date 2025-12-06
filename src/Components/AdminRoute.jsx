// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useIsAdmin from "../hooks/useIsAdmin";
// import useIsAdmin from "../hooks/useIsAdmin";

export default function AdminRoute({ children }) {
  const { isLoading, isAdmin } = useIsAdmin();

  if (isLoading) return <div className="page-shell">Checking admin access…</div>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

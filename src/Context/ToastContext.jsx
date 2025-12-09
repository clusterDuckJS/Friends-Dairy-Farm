// src/contexts/ToastContext.jsx
import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import "../Components/Toasts/toasts.css";
import Toasts from "../Components/Toasts/Toasts";

const ToastContext = createContext();

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback(({ type = "info", title = "", message = "", duration = 4000 }) => {
    const id = nextId++;
    const t = { id, type, title, message, duration };
    setToasts(prev => [t, ...prev]); // newest on top
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const api = useMemo(() => ({
    success: (title, message, duration) => push({ type: "success", title, message, duration }),
    error: (title, message, duration) => push({ type: "error", title, message, duration }),
    info: (title, message, duration) => push({ type: "info", title, message, duration }),
    warn: (title, message, duration) => push({ type: "warn", title, message, duration }),
    remove,
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toasts toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

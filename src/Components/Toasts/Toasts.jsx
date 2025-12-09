// src/components/Toasts.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import './toasts.css';

function ToastItem({ t, onClose }) {
  useEffect(() => {
    if (!t.duration || t.duration <= 0) return;
    const id = setTimeout(() => onClose(t.id), t.duration);
    return () => clearTimeout(id);
  }, [t, onClose]);

  return (
    <div className={`toast toast-${t.type}`} role="status" aria-live="polite">
      <div className="toast-body">
        <div className="toast-title">{t.title}</div>
        {t.message && <div className="toast-message">{t.message}</div>}
      </div>
      <button className="toast-close" onClick={() => onClose(t.id)} aria-label="Close">✕</button>
    </div>
  );
}

export default function Toasts({ toasts = [], onClose }) {
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="toast-viewport">
      {toasts.map(t => (
        <ToastItem key={t.id} t={t} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
}

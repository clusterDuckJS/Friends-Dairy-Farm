import React from "react";
import ReactDOM from "react-dom";
import "./confirm-modal.css";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="confirm-backdrop">
      <div className="confirm-box">
        {title && <h3 className="confirm-title">{title}</h3>}
        {message && <p className="confirm-message">{message}</p>}

        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn ok" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

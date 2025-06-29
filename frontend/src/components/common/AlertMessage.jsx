import React from "react";

function AlertMessage({ type, message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="alert-close">×</button>
    </div>
  );
}

export default AlertMessage;

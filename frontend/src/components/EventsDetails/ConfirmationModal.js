import React from 'react';
import './ConfirmationModal.css'; 

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this event?</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Yes (Delete Event)</button>
          <button className="btn btn-dark" onClick={onClose}>No (Keep Event)</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

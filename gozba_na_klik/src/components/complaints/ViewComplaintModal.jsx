import React from "react";
import { createPortal } from "react-dom";

export default function ViewComplaintModal({ complaint, onClose }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Žalba za porudžbinu #{complaint.orderId}</h2>
        </div>

        <div className="modal-body">
          <div className="complaint-details">
            <div className="complaint-info-item">
              <strong>Porudžbina:</strong> #{complaint.orderId}
            </div>
            {complaint.restaurantName && (
              <div className="complaint-info-item">
                <strong>Restoran:</strong> {complaint.restaurantName}
              </div>
            )}
            {complaint.customerName && (
              <div className="complaint-info-item">
                <strong>Korisnik:</strong> {complaint.customerName}
              </div>
            )}
            <div className="complaint-info-item">
              <strong>Datum podnošenja:</strong> {formatDate(complaint.createdAt)}
            </div>
            <div className="complaint-message-section">
              <h3>Tekst žalbe:</h3>
              <div className="complaint-message-box">
                <p>{complaint.message}</p>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={onClose}
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


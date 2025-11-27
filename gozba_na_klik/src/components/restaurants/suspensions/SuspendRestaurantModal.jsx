import React, { useState } from "react";
import { createPortal } from "react-dom";
import { suspendRestaurant } from "../../service/restaurantsService";
import Spinner from "../../spinner/Spinner";

export default function SuspendRestaurantModal({ restaurant, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (reason.trim().length < 10) {
      setError("Opis suspenzije mora imati najmanje 10 karaktera.");
      return;
    }

    setIsSubmitting(true);
    try {
      await suspendRestaurant(restaurant.id, reason.trim());
      
      if (typeof window !== 'undefined' && window.toast?.success) {
        window.toast.success(`Restoran "${restaurant.name}" je uspešno suspendovan!`);
      }
      
      if (onSuccess) {
        onSuccess(restaurant.id);
      }
      onClose();
    } catch (err) {
      let errorMessage = "Greška pri suspendovanju restorana.";
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors.join(" ");
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Suspenduj restoran</h2>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
              Restoran: <strong>{restaurant.name}</strong>
            </p>
            <label className="form-label">
              Razlog suspenzije (minimum 10 karaktera)
            </label>
            <textarea
              className="form-textarea"
              rows={6}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="Unesite detaljan razlog za suspenziju restorana..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <small className="form-hint">
              {reason.length}/500 karaktera
              {reason.trim().length > 0 && reason.trim().length < 10 && (
                <span style={{ color: "#dc2626", marginLeft: "0.5rem" }}>
                  (minimum 10 karaktera)
                </span>
              )}
            </small>
          </div>

          {error && (
            <div className="error-message">
              <p className="error-message__text">{error}</p>
            </div>
          )}

          {isSubmitting && (
            <div style={{ textAlign: "center", margin: "1rem 0" }}>
              <Spinner />
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="btn btn--danger"
              disabled={isSubmitting || reason.trim().length < 10}
            >
              {isSubmitting ? "Suspendovanje..." : "Suspenduj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


import React, { useState } from "react";
import { createPortal } from "react-dom";
import { createComplaint } from "../service/complaintService";
import Spinner from "../spinner/Spinner";

export default function ComplaintModal({ orderId, onClose, onSuccess }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (message.trim().length < 10) {
      setError("Žalba mora imati najmanje 10 karaktera.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createComplaint(orderId, message.trim());
      
      if (typeof window !== 'undefined' && window.toast?.success) {
        window.toast.success('Žalba je uspešno podneta!');
      }
      
      if (onSuccess) {
        onSuccess(orderId);
      }
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Greška pri podnošenju žalbe.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Uloži žalbu</h2>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Opisite problem (minimum 10 karaktera)
            </label>
            <textarea
              className="form-textarea"
              rows={6}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              placeholder="Unesite detalje vaše žalbe..."
              disabled={isSubmitting}
              maxLength={1000}
            />
            <small className="form-hint">
              {message.length}/1000 karaktera
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
              className="btn btn--primary"
              disabled={isSubmitting || message.trim().length < 10}
            >
              {isSubmitting ? "Podnošenje..." : "Podnesi žalbu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


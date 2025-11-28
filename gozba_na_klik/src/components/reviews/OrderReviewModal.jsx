import React, { useState } from "react";
import { createPortal } from "react-dom";
import { createReview } from "../service/reviewService";
import { validateFile } from "../service/fileService";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";

export default function OrderReviewModal({ orderId, onClose, onSuccess }) {
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState("");
  const [restaurantPhoto, setRestaurantPhoto] = useState(null);
  const [restaurantPhotoPreview, setRestaurantPhotoPreview] = useState(null);
  const [courierRating, setCourierRating] = useState(0);
  const [courierComment, setCourierComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setRestaurantPhoto(null);
      setRestaurantPhotoPreview(null);
      return;
    }

    const validation = validateFile(file);
    if (validation !== true) {
      setError(validation);
      return;
    }

    setRestaurantPhoto(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setRestaurantPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setRestaurantPhoto(null);
    setRestaurantPhotoPreview(null);
  };

  const handleRatingClick = (rating, type) => {
    if (type === "restaurant") {
      setRestaurantRating(rating);
    } else {
      setCourierRating(rating);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (restaurantRating < 1 || restaurantRating > 5) {
      setError("Molimo ocenite restoran (1-5 zvezdica).");
      return;
    }

    if (courierRating < 1 || courierRating > 5) {
      setError("Molimo ocenite kurira (1-5 zvezdica).");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("restaurantRating", restaurantRating);
      if (restaurantComment.trim()) {
        formData.append("restaurantComment", restaurantComment.trim());
      }
      if (restaurantPhoto) {
        formData.append("restaurantPhoto", restaurantPhoto);
      }
      formData.append("courierRating", courierRating);
      if (courierComment.trim()) {
        formData.append("courierComment", courierComment.trim());
      }

      await createReview(formData);

      if (typeof window !== "undefined" && window.toast?.success) {
        window.toast.success("Recenzija je uspešno kreirana!");
      }

      if (onSuccess) {
        onSuccess(orderId);
      }
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Greška pri kreiranju recenzije.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, type, maxRating = 5) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? "star--filled" : "star--empty"}`}
            onClick={() => handleRatingClick(star, type)}
            disabled={isSubmitting}
            aria-label={`Oceni ${star} od ${maxRating}`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="star-rating__value">{rating}/5</span>
        )}
      </div>
    );
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Oceni porudžbinu</h2>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Restaurant Rating Section */}
          <div className="review-section">
            <h3 className="review-section__title">Ocena restorana</h3>
            <div className="review-section__content">
              <div className="form-group">
                <label className="form-label">Ocena (obavezno)</label>
                {renderStars(restaurantRating, "restaurant")}
              </div>

              <div className="form-group">
                <label className="form-label">Komentar (opciono)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={restaurantComment}
                  onChange={(e) => {
                    setRestaurantComment(e.target.value);
                    setError("");
                  }}
                  placeholder="Podelite svoje iskustvo sa restoranom..."
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <small className="form-hint">
                  {restaurantComment.length}/500 karaktera
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Fotografija (opciono)</label>
                {restaurantPhotoPreview ? (
                  <div className="image-preview">
                    <img
                      src={restaurantPhotoPreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "2px solid #e5e7eb",
                        marginBottom: "0.75rem"
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={handleRemovePhoto}
                      disabled={isSubmitting}
                    >
                      Ukloni fotografiju
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="restaurantPhoto"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      disabled={isSubmitting}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="restaurantPhoto"
                      className="btn btn--secondary btn--small"
                      style={{ display: "inline-block", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                    >
                      Izaberi fotografiju
                    </label>
                    <small className="form-hint" style={{ display: "block", marginTop: "0.5rem" }}>
                      Dozvoljeni formati: JPEG, PNG, WebP (max 5MB)
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Courier Rating Section */}
          <div className="review-section">
            <h3 className="review-section__title">Ocena kurira</h3>
            <div className="review-section__content">
              <div className="form-group">
                <label className="form-label">Ocena (obavezno)</label>
                {renderStars(courierRating, "courier")}
              </div>

              <div className="form-group">
                <label className="form-label">Komentar (opciono)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={courierComment}
                  onChange={(e) => {
                    setCourierComment(e.target.value);
                    setError("");
                  }}
                  placeholder="Podelite svoje iskustvo sa kuriron..."
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <small className="form-hint">
                  {courierComment.length}/500 karaktera
                </small>
              </div>
            </div>
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
              disabled={
                isSubmitting ||
                restaurantRating < 1 ||
                restaurantRating > 5 ||
                courierRating < 1 ||
                courierRating > 5
              }
            >
              {isSubmitting ? "Kreiranje..." : "Pošalji recenziju"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


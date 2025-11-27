import React, { useState, useEffect } from "react";
import { getRestaurantReviews } from "../service/reviewService";
import Pagination from "../utils/Pagination";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";

export default function RestaurantReviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!restaurantId) return;
    loadReviews();
  }, [restaurantId, currentPage, pageSize]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRestaurantReviews(restaurantId, currentPage, pageSize);

      // Handle both camelCase and PascalCase response formats
      const items = response.items || response.Items || [];
      setReviews(items);
      setTotalPages(response.totalPages || response.TotalPages || 0);
      setTotalCount(response.count || response.Count || 0);
      setHasNextPage(response.hasNextPage || response.HasNextPage || false);
      setHasPreviousPage(
        response.hasPreviousPage || response.HasPreviousPage || false
      );

      // Calculate average rating from total count
      // We'll calculate from all reviews by getting a large page
      // In production, you might want a separate endpoint for average
      if (totalCount > 0) {
        const allReviewsResponse = await getRestaurantReviews(restaurantId, 1, 1000);
        const allItems = allReviewsResponse.items || allReviewsResponse.Items || [];
        if (allItems.length > 0) {
          const sum = allItems.reduce(
            (acc, review) =>
              acc + (review.restaurantRating || review.RestaurantRating || 0),
            0
          );
          setAverageRating(sum / allItems.length);
        } else {
          setAverageRating(0);
        }
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.error("Greška pri učitavanju recenzija:", err);
      setError("Greška pri učitavanju recenzija.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-display">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star star--filled">
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span className="star star--half">★</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star star--empty">
            ★
          </span>
        ))}
        <span className="star-display__value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderRating = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "star--filled" : "star--empty"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${baseUrl}${photoUrl}`;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="restaurant-reviews">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="restaurant-reviews">
      <div className="restaurant-reviews__header">
        <h2>Recenzije</h2>
        {totalCount > 0 && (
          <div className="restaurant-reviews__stats">
            <div className="average-rating">
              <span className="average-rating__label">Prosečna ocena:</span>
              {renderStars(averageRating)}
            </div>
            <span className="reviews-count">
              ({totalCount} {totalCount === 1 ? "recenzija" : "recenzija"})
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p className="error-message__text">{error}</p>
          <button className="btn btn--secondary" onClick={loadReviews}>
            Pokušaj ponovo
          </button>
        </div>
      )}

      {totalCount > 0 && (
        <Pagination
          page={currentPage - 1}
          pageCount={totalPages}
          totalCount={totalCount}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {loading ? (
        <div className="loading-more">
          <Spinner />
          <p>Učitavanje recenzija...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">⭐</div>
          <h3>Još nema recenzija</h3>
          <p>Budite prvi koji će oceniti ovaj restoran!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => {
            const restaurantRating =
              review.restaurantRating || review.RestaurantRating || 0;
            const courierRating =
              review.courierRating || review.CourierRating || 0;
            const restaurantComment =
              review.restaurantComment || review.RestaurantComment || "";
            const courierComment =
              review.courierComment || review.CourierComment || "";
            const restaurantPhotoUrl =
              review.restaurantPhotoUrl || review.RestaurantPhotoUrl || null;
            const createdAt = review.createdAt || review.CreatedAt;

            return (
              <div key={review.id || review.Id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__date">
                    {formatDate(createdAt)}
                  </div>
                </div>

                <div className="review-card__content">
                  {/* Restaurant Review */}
                  <div className="review-section">
                    <div className="review-section__header">
                      <h4 className="review-section__title">Restoran</h4>
                      {renderRating(restaurantRating)}
                    </div>
                    {restaurantComment && (
                      <p className="review-section__comment">
                        {restaurantComment}
                      </p>
                    )}
                    {restaurantPhotoUrl && (
                      <div className="review-section__photo">
                        <img
                          src={getPhotoUrl(restaurantPhotoUrl)}
                          alt="Review photo"
                          className="review-photo"
                        />
                      </div>
                    )}
                  </div>

                  {/* Courier Review */}
                  <div className="review-section">
                    <div className="review-section__header">
                      <h4 className="review-section__title">Kurir</h4>
                      {renderRating(courierRating)}
                    </div>
                    {courierComment && (
                      <p className="review-section__comment">
                        {courierComment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalCount > 0 && (
        <Pagination
          page={currentPage - 1}
          pageCount={totalPages}
          totalCount={totalCount}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}


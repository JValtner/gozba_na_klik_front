import React, { useState, useEffect } from "react";
import { useUser } from "../users/UserContext";
import { getCourierDeliveryHistory } from "../service/orderService";
import Spinner from "../spinner/Spinner";
import Pagination from "../utils/Pagination";
import "../../styles/_courier-history.scss";

const CourierHistoryPage = () => {
  const { userId, username } = useUser();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadDeliveries();
  }, [userId, fromDate, toDate, currentPage, pageSize]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      // Convert date strings to ISO format (date only, no time)
      // For fromDate, set to start of day (00:00:00)
      // For toDate, set to end of day (23:59:59)
      let fromDateParam = null;
      let toDateParam = null;

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        fromDateParam = from.toISOString();
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        toDateParam = to.toISOString();
      }

      const response = await getCourierDeliveryHistory(
        userId,
        fromDateParam,
        toDateParam,
        currentPage,
        pageSize
      );

      // Handle both camelCase and PascalCase response formats
      const items = response.items || response.Items || [];
      setDeliveries(items);
      setTotalPages(response.totalPages || response.TotalPages || 0);
      setTotalCount(response.count || response.Count || 0);
      setHasNextPage(response.hasNextPage || response.HasNextPage || false);
      setHasPreviousPage(
        response.hasPreviousPage || response.HasPreviousPage || false
      );
    } catch (err) {
      console.error("Greška pri učitavanju istorije isporuka:", err);
      setError(err.message || "Greška pri učitavanju istorije isporuka");
    } finally {
      setLoading(false);
    }
  };

  const handleFromDateChange = (newDate) => {
    setFromDate(newDate);
    setCurrentPage(1);
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading && currentPage === 1) {
    return <Spinner />;
  }

  return (
    <div className="courier-history-page">
      <div className="courier-history-page__container">
        <div className="courier-history-page__header">
          <div>
            <h1>Istorija isporuka</h1>
            <p>
              Dobrodošli {username}, ovde možete videti sve vaše završene
              isporuke
            </p>
          </div>
        </div>

        <div className="courier-history-filters">
          <div className="filter-group">
            <label htmlFor="fromDate">Od datuma:</label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="toDate">Do datuma:</label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="form-input"
              min={fromDate || undefined}
            />
          </div>

          {(fromDate || toDate) && (
            <div className="filter-actions">
              <button
                className="btn btn--secondary btn--small"
                onClick={handleClearFilters}
              >
                Obriši filtere
              </button>
            </div>
          )}

          <div className="deliveries-stats">
            <span className="stat">
              Ukupno: <strong>{totalCount}</strong>
            </span>
          </div>
        </div>

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

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
            <button className="btn btn--secondary" onClick={loadDeliveries}>
              Pokušaj ponovo
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-more">
            <Spinner />
            <p>Učitavanje isporuka...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h2>
              {fromDate || toDate
                ? "Nema isporuka za odabrani period"
                : "Još nemate nijednu završenu isporuku"}
            </h2>
            <p>
              {!fromDate && !toDate &&
                "Kada završite isporuke, pojaviće se ovde."}
            </p>
          </div>
        ) : (
          <div className="deliveries-list">
            {deliveries.map((delivery) => (
              <div key={delivery.orderId} className="delivery-history-card">
                <div className="delivery-history-card__header">
                  <div className="delivery-info">
                    <h3>Porudžbina #{delivery.orderId}</h3>
                    <p className="restaurant-name">
                      🍽️ {delivery.restaurantName || "Nepoznat restoran"}
                    </p>
                  </div>
                  <div className="delivery-price">
                    <span className="price-label">Ukupno:</span>
                    <span className="price-value">
                      {formatPrice(delivery.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="delivery-history-card__content">
                  <div className="time-info-grid">
                    <div className="time-info-item">
                      <div className="time-info-label">Vreme preuzimanja:</div>
                      <div className="time-info-value">
                        {formatDateTime(delivery.pickupTime)}
                      </div>
                    </div>

                    <div className="time-info-item">
                      <div className="time-info-label">Vreme isporuke:</div>
                      <div className="time-info-value">
                        {formatDateTime(delivery.deliveryTime)}
                      </div>
                    </div>

                    <div className="time-info-item time-info-item--highlight">
                      <div className="time-info-label">Trajanje:</div>
                      <div className="time-info-value time-info-value--duration">
                        {delivery.durationMinutes !== null &&
                        delivery.durationMinutes !== undefined
                          ? `${delivery.durationMinutes} min`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default CourierHistoryPage;


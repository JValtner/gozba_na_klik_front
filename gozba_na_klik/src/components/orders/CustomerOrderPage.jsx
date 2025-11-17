import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getUserOrderHistory } from "../service/orderService";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../constants/orderConstants";
import InvoiceButton from "../invoices/InvoiceButton";
import Spinner from "../spinner/Spinner";
import Pagination from "../utils/Pagination";

const CustomerOrdersPage = () => {
  const navigate = useNavigate();
  const { userId, username } = useUser();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadOrders();
  }, [userId, statusFilter, currentPage, pageSize]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUserOrderHistory(
        userId, 
        statusFilter || null, 
        currentPage, 
        pageSize
      );

      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalItems || 0);
      setHasNextPage(response.hasNextPage || false);
      setHasPreviousPage(response.hasPreviousPage || false);

    } catch (err) {
      console.error("Greška pri učitavanju porudžbina:", err);
      setError(err.message || "Greška pri učitavanju istorije porudžbina");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading && currentPage === 1) {
    return <Spinner />;
  }

  return (
    <div className="customer-orders-page">
      <div className="customer-orders-page__container">
        
        <div className="customer-orders-page__header">
          <div>
            <h1>Moje porudžbine</h1>
            <p>Dobrodošli {username}, ovde možete videti sve vaše porudžbine</p>
          </div>
        </div>

        <div className="customer-orders-filters">
          <div className="filter-group">
            <label htmlFor="statusFilter">Filtriraj po statusu:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="form-input"
            >
              <option value="">Sve porudžbine</option>
              <option value="NA_CEKANJU">Na čekanju</option>
              <option value="PRIHVAĆENA">Prihvaćene</option>
              <option value="PREUZIMANJE U TOKU">Preuzimanje u toku</option>
              <option value="ZAVRŠENO">Završene</option>
              <option value="OTKAZANA">Otkazane</option>
            </select>
          </div>

          <div className="orders-stats">
            <span className="stat">
              Ukupno: <strong>{totalItems}</strong>
            </span>
            {statusFilter && (
              <span className="stat">
                {ORDER_STATUS_LABELS[statusFilter]}: <strong>{orders.length}</strong>
              </span>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination
            page={currentPage - 1}
            pageCount={totalPages}
            totalCount={totalItems}
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
            <button className="btn btn--secondary" onClick={loadOrders}>
              Pokušaj ponovo
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-more">
            <Spinner />
            <p>Učitavanje porudžbina...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h2>
              {statusFilter 
                ? `Nemate porudžbine sa statusom "${ORDER_STATUS_LABELS[statusFilter]}"`
                : "Još nemate nijednu porudžbinu"
              }
            </h2>
            <p>
              {!statusFilter && "Kada napravite porudžbinu, pojaviće se ovde."}
            </p>
            <button
              className="btn btn--primary"
              onClick={() => navigate("/restaurants/home")}
            >
              Naručite sada
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="customer-order-card">
                
                <div className="customer-order-card__header">
                  <div className="order-info">
                    <h3>Porudžbina #{order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  
                  <div className="order-status-info">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: ORDER_STATUS_COLORS[order.status] }}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <span className="order-total">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="customer-order-card__content">
                  
                  <div className="restaurant-info">
                    <h4> {order.restaurantName}</h4>
                    {order.deliveryAddress && (
                      <p>📍 {order.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="order-items-preview">
                    <p>
                      <strong>{order.itemsCount}</strong> stavka
                      {order.itemsCount !== 1 && (order.itemsCount % 10 !== 1 || order.itemsCount === 11) ? "e" : ""}
                    </p>
                    {order.items && order.items.length > 0 && (
                      <div className="items-summary">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index} className="item-name">
                            {item.mealName} 
                            {item.quantity > 1 && ` x${item.quantity}`}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="more-items">
                            +{order.items.length - 2} više
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {order.customerNote && (
                    <div className="customer-note">
                      <p><strong>Napomena:</strong> {order.customerNote}</p>
                    </div>
                  )}

                  {order.hasAllergenWarning && (
                    <div className="allergen-warning">
                      <span>⚠️ Sadrži alergene</span>
                    </div>
                  )}
                </div>

                <div className="customer-order-card__actions">
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Detalji
                  </button>

                  <InvoiceButton
                    orderId={order.id}
                    orderStatus={order.status}
                    variant="secondary"
                    size="small"
                  >
                    Račun
                  </InvoiceButton>

                  <button
                    className="btn btn--primary btn--small"
                    onClick={() => navigate(`/restaurants/${order.restaurantId}/menu`)}
                  >
                    Naruči ponovo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            page={currentPage - 1}
            pageCount={totalPages}
            totalCount={totalItems}
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

export default CustomerOrdersPage;
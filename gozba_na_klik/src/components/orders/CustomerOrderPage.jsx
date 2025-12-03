import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getUserOrderHistory } from "../service/orderService";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../constants/orderConstants";
import InvoiceButton from "../invoices/InvoiceButton";
import ComplaintModal from "../complaints/ComplaintModal";
import ViewComplaintModal from "../complaints/ViewComplaintModal";
import OrderReviewModal from "../reviews/OrderReviewModal";
import Spinner from "../spinner/Spinner";
import Pagination from "../utils/Pagination";
import {
  getComplaintByOrderId,
  checkComplaintExists,
} from "../service/complaintService";

const CustomerOrdersPage = () => {
  const navigate = useNavigate();
  const { userId, username } = useUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showViewComplaintModal, setShowViewComplaintModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersWithComplaints, setOrdersWithComplaints] = useState(new Set());
  const [ordersWithReviews, setOrdersWithReviews] = useState(new Set());
  const [complaintsData, setComplaintsData] = useState(new Map());

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

      const ordersList = response.orders || response.Orders || [];
      setOrders(ordersList);
      setTotalPages(response.totalPages || response.TotalPages || 0);
      setTotalItems(
        response.totalCount || response.TotalCount || response.totalItems || 0
      );
      setHasNextPage(response.hasNextPage || response.HasNextPage || false);
      setHasPreviousPage(
        response.hasPreviousPage || response.HasPreviousPage || false
      );

      const completedOrders = ordersList.filter((order) =>
        isOrderCompleted(order.status)
      );

      if (completedOrders.length > 0) {
        const complaintChecks = await Promise.all(
          completedOrders.map(async (order) => {
            const exists = await checkComplaintExists(order.id);
            if (exists) {
              const complaint = await getComplaintByOrderId(order.id);
              if (complaint) {
                return { orderId: order.id, complaint };
              }
            }
            return null;
          })
        );

        const ordersWithComplaintsSet = new Set();
        const complaintsMap = new Map();

        complaintChecks.forEach((result) => {
          if (result) {
            ordersWithComplaintsSet.add(result.orderId);
            complaintsMap.set(result.orderId, result.complaint);
          }
        });

        setOrdersWithComplaints(ordersWithComplaintsSet);
        setComplaintsData(complaintsMap);
      }
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
  };

  const isOrderCompleted = (status) => {
    return status === "ZAVRŠENO";
  };

  const handleOpenComplaintModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowComplaintModal(true);
  };

  const handleComplaintSuccess = async (orderId) => {
    // Dodaj porudžbinu u set porudžbina sa žalbama i učitaj žalbu
    const complaint = await getComplaintByOrderId(orderId);
    if (complaint) {
      setOrdersWithComplaints((prev) => new Set([...prev, orderId]));
      setComplaintsData((prev) => new Map(prev).set(orderId, complaint));
    }
    loadOrders();
    setCurrentPage(1);
  };

  const handleViewComplaint = async (orderId) => {
    let complaint = complaintsData.get(orderId);
    if (!complaint) {
      complaint = await getComplaintByOrderId(orderId);
      if (complaint) {
        setComplaintsData((prev) => new Map(prev).set(orderId, complaint));
      }
    }
    if (complaint) {
      setSelectedOrderId(orderId);
      setShowViewComplaintModal(true);
    }
  };

  const handleOpenReviewModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = async (orderId) => {
    setOrdersWithReviews((prev) => new Set([...prev, orderId]));
    loadOrders();
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
                {ORDER_STATUS_LABELS[statusFilter]}:{" "}
                <strong>{orders.length}</strong>
              </span>
            )}
          </div>
        </div>

        {totalItems > 0 && (
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
                : "Još nemate nijednu porudžbinu"}
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
                      style={{
                        backgroundColor: ORDER_STATUS_COLORS[order.status],
                      }}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <span className="order-total">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="customer-order-card__content">
                  <div className="restaurant-info">
                    <h4> {order.restaurantName}</h4>
                    {order.deliveryAddress && <p>📍 {order.deliveryAddress}</p>}
                  </div>

                  <div className="order-items-preview">
                    <p>
                      <strong>{order.itemsCount}</strong>{" "}
                      {order.itemsCount === 1 ? "stavka" : "stavke"}
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
                      <p>
                        <strong>Napomena:</strong> {order.customerNote}
                      </p>
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
                    onClick={() =>
                      navigate(`/restaurants/${order.restaurantId}/menu`)
                    }
                  >
                    Naruči ponovo
                  </button>

                  {isOrderCompleted(order.status) && (
                    <>
                      {ordersWithReviews.has(order.id) ? (
                        <button
                          className="btn btn--secondary btn--small"
                          disabled
                          title="Recenzija već postoji"
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            cursor: "not-allowed",
                          }}
                        >
                          ✓ Ocenjeno
                        </button>
                      ) : (
                        <button
                          className="btn btn--primary btn--small"
                          onClick={() => handleOpenReviewModal(order.id)}
                          title="Oceni porudžbinu"
                        >
                          ⭐ Oceni
                        </button>
                      )}
                      {ordersWithComplaints.has(order.id) ? (
                        <button
                          className="btn btn--secondary btn--small"
                          onClick={() => handleViewComplaint(order.id)}
                          title="Vidi žalbu"
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                          }}
                        >
                          ✓ Vidi žalbu
                        </button>
                      ) : (
                        <button
                          className="btn btn--secondary btn--small"
                          onClick={() => handleOpenComplaintModal(order.id)}
                          title="Uloži žalbu"
                        >
                          Uloži žalbu
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showComplaintModal && (
          <ComplaintModal
            orderId={selectedOrderId}
            onClose={() => {
              setShowComplaintModal(false);
              setSelectedOrderId(null);
            }}
            onSuccess={() => handleComplaintSuccess(selectedOrderId)}
          />
        )}

        {showViewComplaintModal && complaintsData.get(selectedOrderId) && (
          <ViewComplaintModal
            complaint={complaintsData.get(selectedOrderId)}
            onClose={() => {
              setShowViewComplaintModal(false);
              setSelectedOrderId(null);
            }}
          />
        )}

        {showReviewModal && (
          <OrderReviewModal
            orderId={selectedOrderId}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedOrderId(null);
            }}
            onSuccess={handleReviewSuccess}
          />
        )}

        {totalItems > 0 && (
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

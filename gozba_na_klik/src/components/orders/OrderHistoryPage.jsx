import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserOrderHistory } from "../service/orderService";
import Spinner from "../spinner/Spinner";

const OrderHistoryPage = () => {
  const { id: userId } = useParams();
  const [activeOrders, setActiveOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, [userId, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch active orders (not COMPLETED or CANCELLED)
      const activeResponse = await getUserOrderHistory(userId, "active", 1, 100);
      setActiveOrders(activeResponse.orders || []);

      // Fetch archived orders (COMPLETED or CANCELLED) with pagination
      const archivedResponse = await getUserOrderHistory(userId, "archived", currentPage, pageSize);
      setArchivedOrders(archivedResponse.orders || []);
      setTotalPages(Math.ceil((archivedResponse.totalCount || 0) / pageSize));
      setTotalCount(archivedResponse.totalCount || 0);
    } catch (err) {
      setError("Greška pri učitavanju porudžbina.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Na čekanju",
      CONFIRMED: "Potvrđena", 
      IN_PREPARATION: "U pripremi",
      READY_FOR_DELIVERY: "Spremna za dostavu",
      OUT_FOR_DELIVERY: "Na dostavi",
      DELIVERED: "Dostavljena",
      COMPLETED: "Završena",
      CANCELLED: "Otkazana",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      PENDING: "status-pending",
      CONFIRMED: "status-confirmed",
      IN_PREPARATION: "status-preparation", 
      READY_FOR_DELIVERY: "status-ready",
      OUT_FOR_DELIVERY: "status-delivery",
      DELIVERED: "status-delivered",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
    };
    return statusClasses[status] || "status-default";
  };

  const renderOrderCard = (order, isArchived = false) => (
    <div key={order.id} className={`order-card ${isArchived ? 'archived' : 'active'}`}>
      <div className="order-header">
        <span className="order-id">Porudžbina #{order.id}</span>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      <div className="order-details">
        <p><strong>Restoran:</strong> {order.restaurantName}</p>
        <p><strong>Datum:</strong> {formatDate(order.orderDate)}</p>
        <p><strong>Ukupno:</strong> {order.totalAmount} RSD</p>
        {order.deliveryAddress && (
          <p><strong>Adresa:</strong> {order.deliveryAddress}</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      
      <div className="table-container">
        <div className="title-container">
          <div>
            <h1>Istorija porudžbina</h1>
            <p>Pregledajte vaše aktivne i arhivirane porudžbine</p>
          </div>
        </div>

        {/* Active Orders Section */}
        <div className="active-orders-section">
          <h2>Aktivne porudžbine</h2>
          {activeOrders.length === 0 ? (
            <div className="empty-state">
              <p>Nemate aktivnih porudžbina.</p>
            </div>
          ) : (
            <div className="orders-list">
              {activeOrders.map((order) => renderOrderCard(order, false))}
            </div>
          )}
        </div>

        {/* Archived Orders Section */}
        <div className="archived-orders-section">
          <h2>Arhivirane porudžbine</h2>
          {archivedOrders.length === 0 ? (
            <div className="empty-state">
              <p>Nemate arhiviranih porudžbina.</p>
            </div>
          ) : (
            <>
              <div className="orders-list">
                {archivedOrders.map((order) => renderOrderCard(order, true))}
              </div>

              {/* Pagination for archived orders */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Prethodna
                  </button>
                  <span className="pagination-info">
                    Strana {currentPage} od {totalPages} (ukupno {totalCount} porudžbina)
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Sledeća
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;

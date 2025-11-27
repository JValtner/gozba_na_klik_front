import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserOrderHistory } from "../service/orderService";
import Spinner from "../spinner/Spinner";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../constants/orderConstants";

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

      // Fetch active orders (not ZAVRŠENO or OTKAZANA)
      const activeResponse = await getUserOrderHistory(userId, "active", 1, 100);
      setActiveOrders(activeResponse.orders || []);

      // Fetch archived orders (ZAVRŠENO or OTKAZANA) with pagination
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
    return ORDER_STATUS_LABELS[status] || status;
  };

  const getStatusClass = (status) => {
    // Map status to CSS class based on the status value
    const statusClassMap = {
      "NA ČEKANJU": "status-pending",
      "NA_CEKANJU": "status-pending",
      "PRIHVAĆENA": "status-confirmed",
      "PREUZIMANJE U TOKU": "status-pickup",
      "DOSTAVA U TOKU": "status-delivery",
      "ZAVRŠENO": "status-completed",
      "OTKAZANA": "status-cancelled",
    };
    return statusClassMap[status] || "status-default";
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

import React, { useState, useEffect } from "react";
import { useUser } from "../users/UserContext";
import {
  getActiveOrderByCourier,
  updateOrderToInDelivery,
  updateOrderToDelivered,
} from "../service/orderService";
import CourierOrderCard from "./CourierOrderCard";
import Spinner from "../spinner/Spinner";
import { useNavigate } from "react-router-dom";

export default function CourierOrderDashboard() {
  const { userId } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await getActiveOrderByCourier(userId);
      setOrder(orderData);
    } catch (err) {
      console.error("Greška pri učitavanju porudžbine:", err);
      if (err.response?.status === 404) {
        setOrder(null); // Nema aktivne porudžbine
      } else {
        setError("Greška pri učitavanju porudžbine.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      let response;

      if (newStatus === "DOSTAVA U TOKU") {
        response = await updateOrderToInDelivery(order.orderId);
      } else if (newStatus === "ZAVRŠENO") {
        response = await updateOrderToDelivered(order.orderId);
      }

      if (response) {
        setStatusMsg(`Porudžbina je uspešno ažurirana na status: ${newStatus}`);
        await loadOrder(); // ponovo učitava order
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      console.error("Greška pri ažuriranju statusa:", err);
      setError("Greška pri ažuriranju statusa porudžbine.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (order) {
      return;
    }
    loadOrder();

    const interval = setInterval(() => {
      loadOrder();
    }, 12000);

    return () => clearInterval(interval);
  }, [userId, order]);

  if (loading) return <Spinner />;

  return (
    <div className="courier-dashboard">
      <div className="courier-dashboard__container">
        <div className="courier-dashboard__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/delivery/dashboard")}
          >
            ← Nazad
          </button>
          <div>
            <h1>🚚 Dostava</h1>
            <p>Upravljajte svojim dostavama</p>
          </div>
        </div>

        {statusMsg && (
          <div className="status-message">
            <p className="status-message__text">{statusMsg}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        {!order ? (
          <div className="courier-dashboard__empty">
            <div className="empty-state">
              <span className="empty-state__icon">📦</span>
              <h2>Trenutno nemate dodeljenu porudžbinu</h2>
              <p>Čekajte da vam sistem dodeli novu dostavu</p>
            </div>
          </div>
        ) : (
          <CourierOrderCard
            order={order}
            onStatusUpdate={handleStatusUpdate}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
}

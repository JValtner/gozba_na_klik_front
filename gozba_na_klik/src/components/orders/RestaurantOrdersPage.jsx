import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import {
  getRestaurantOrders,
  acceptOrder,
  cancelOrder,
} from "../service/orderService";
import Spinner from "../spinner/Spinner";
import InvoiceButton from "../invoices/InvoiceButton";
import { getStatusLabel } from "../../constants/orderConstants";
import "../../styles/_restaurant-orders.scss";

const RestaurantOrdersPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("NA_CEKANJU");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantOrders(restaurantId, userId, filterStatus);
      setOrders(data);
    } catch (err) {
      console.error("Greška pri učitavanju porudžbina:", err);
      setError("Došlo je do greške pri učitavanju porudžbina.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus, restaurantId]);

  const handleAccept = async (orderId) => {
    const minutes = prompt("Unesite procenjeno vreme pripreme (u minutima):");
    if (!minutes) return;

    try {
      await acceptOrder(orderId, userId, parseInt(minutes, 10));
      alert("Porudžbina je uspešno prihvaćena!");
      loadOrders();
    } catch (err) {
      console.error("Greška pri prihvatanju porudžbine:", err);
      alert("Greška pri prihvatanju porudžbine.");
    }
  };

  const handleCancel = async (orderId) => {
    const reason = prompt("Unesite razlog otkazivanja porudžbine:");
    if (!reason) return;

    try {
      await cancelOrder(orderId, userId, reason);
      alert("Porudžbina je otkazana.");
      loadOrders();
    } catch (err) {
      console.error("Greška pri otkazivanju:", err);
      alert("Greška pri otkazivanju porudžbine.");
    }
  };


  if (loading) return <Spinner />;

  return (
    <div className="restaurant-orders">
      <div className="restaurant-orders__container">
        <div className="restaurant-orders__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/restaurants/dashboard")}
          >
            ← Nazad na restorane
          </button>
          <div>
            <h1>Porudžbine restorana</h1>
            <p>Pregled i upravljanje pristiglim porudžbinama</p>
          </div>
        </div>

        <div className="orders-filter">
          <label>Status: </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input"
          >
            <option value="NA_CEKANJU">Na čekanju</option>
            <option value="PRIHVAĆENA">Prihvaćene</option>
            <option value="U_PRIPREMI">U pripremi</option>
            <option value="SPREMNA">Spremne</option>
            <option value="U_DOSTAVI">U dostavi</option>
            <option value="ISPORUČENA">Isporučene</option>
            <option value="ZAVRŠENO">Završene</option>
            <option value="OTKAZANA">Otkazane</option>
            <option value="">Sve</option>
          </select>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>Trenutno nema porudžbina sa statusom {getStatusLabel(filterStatus)}.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card__header">
                  <h3>Porudžbina #{order.id}</h3>
                  <span
                    className={`status-badge ${
                      order.status === "NA_CEKANJU"
                        ? "status-badge--pending"
                        : order.status === "PRIHVAĆENA"
                        ? "status-badge--accepted"
                        : order.status === "ISPORUČENA" || order.status === "ZAVRŠENO"
                        ? "status-badge--completed"
                        : "status-badge--cancelled"
                    }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-card__details">
                  <p>
                    <strong>Kupac:</strong> {order.customerName || "Nepoznato"}
                  </p>
                  <p>
                    <strong>Adresa:</strong> {order.deliveryAddress}
                  </p>
                  <p>
                    <strong>Ukupna cena:</strong> {order.totalPrice} RSD
                  </p>
                  <p>
                    <strong>Broj artikala:</strong> {order.itemsCount}
                  </p>
                  {order.customerNote && (
                    <p>
                      <strong>Napomena:</strong> {order.customerNote}
                    </p>
                  )}
                </div>

                <div className="order-card__actions">
                  {order.status === "NA_CEKANJU" && (
                    <>
                      <button
                        className="btn btn--success"
                        onClick={() => handleAccept(order.id)}
                      >
                        Prihvati
                      </button>
                      <button
                        className="btn btn--danger"
                        onClick={() => handleCancel(order.id)}
                      >
                        Otkaži
                      </button>
                    </>
                  )}
                  
                  {order.status === "PRIHVAĆENA" && (
                    <span className="preparation-time">
                      ⏱ Priprema: {order.estimatedPreparationMinutes} min
                    </span>
                  )}

                  <InvoiceButton 
                    orderId={order.id}
                    orderStatus={order.status}
                    variant="secondary"
                    size="small"
                  >
                    Račun
                  </InvoiceButton>

                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() => navigate(`/orders/${order.id}`, { state: { restaurantId } })}
                  >
                    Detalji
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrdersPage;
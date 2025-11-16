import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/routeConfig";
import Spinner from "../spinner/Spinner";
import AxiosConfig from "../../config/axios.config";
import InvoiceButton from "../invoices/InvoiceButton";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await AxiosConfig.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Greška pri učitavanju porudžbine:", err);
        setError("Greška pri učitavanju porudžbine.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const getStatusLabel = (status) => {
  const statusMap = {
    "NA_CEKANJU": "Na čekanju",
    "PRIHVAĆENA": "Prihvaćena",
    "PREUZIMANJE U TOKU": "Preuzimanje u toku",
    "DOSTAVA U TOKU": "U dostavi",
    "ZAVRŠENO": "Završeno",
    "OTKAZANA": "Otkazana"
  };
  return statusMap[status] || status;
};

  const getStatusColor = (status) => {
  const statusColors = {
    "NA_CEKANJU": "#f59e0b",
    "PRIHVAĆENA": "#10b981",
    "PREUZIMANJE U TOKU": "#8b5cf6",
    "DOSTAVA U TOKU": "#6366f1",
    "ZAVRŠENO": "#10b981",
    "OTKAZANA": "#ef4444"
  };
  return statusColors[status] || "#6b7280";
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !order) {
    return (
      <div className="order-error">
        <div className="error-message">
          <p className="error-message__text">{error || "Porudžbina nije pronađena."}</p>
          <button className="btn btn--primary" onClick={() => navigate("/")}>
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-page__container">
        <div className="order-details-page__header">
          <div>
            <h1>Porudžbina #{order.id}</h1>
            <p>Kreirana: {formatDate(order.orderDate)}</p>
          </div>
          <div className="order-details-page__header-actions">
            <div 
              className="order-status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {getStatusLabel(order.status)}
            </div>
            
            <InvoiceButton 
              orderId={order.id}
              orderStatus={order.status}
              variant="primary"
              size="normal"
            >
              Prikaži račun
            </InvoiceButton>
          </div>
        </div>

        <div className="order-details-grid">
          <div className="details-card">
            <h2>Restoran</h2>
            <p className="restaurant-name">{order.restaurantName}</p>
          </div>

          <div className="details-card">
            <h2>Adresa dostave</h2>
            <p>{order.deliveryAddress}</p>
          </div>

          {order.customerNote && (
            <div className="details-card">
              <h2>Napomena</h2>
              <p>{order.customerNote}</p>
            </div>
          )}

          {order.hasAllergenWarning && (
            <div className="details-card allergen-warning-card">
              <h2>⚠️ Upozorenje</h2>
              <p>Ova porudžbina sadrži alergene</p>
            </div>
          )}
        </div>

        <div className="order-items-section">
          <h2>Stavke porudžbine</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item-card">
                <div className="order-item-card__image">
                  {item.mealImagePath ? (
                    <img
                      src={`${baseUrl}${item.mealImagePath}`}
                      alt={item.mealName}
                      onError={(e) => {
                        e.target.src = "/default-meal.png";
                      }}
                    />
                  ) : (
                    <div className="order-item-card__placeholder">🍽️</div>
                  )}
                </div>
                <div className="order-item-card__details">
                  <h3>{item.mealName}</h3>
                  <p>Količina: {item.quantity}</p>
                  <p>Cena: {item.unitPrice.toFixed(2)} RSD</p>
                  
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="order-item-card__addons">
                      <strong>Dodaci:</strong>
                      <ul>
                        {item.selectedAddons.map((addon, index) => (
                          <li key={index}>{addon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="order-item-card__total">
                  <strong>{item.totalPrice.toFixed(2)} RSD</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-pricing-summary">
          <div className="pricing-row">
            <span>Međuzbir:</span>
            <span>{order.subtotalPrice.toFixed(2)} RSD</span>
          </div>
          <div className="pricing-row">
            <span>Dostava:</span>
            <span>{order.deliveryFee.toFixed(2)} RSD</span>
          </div>
          <div className="pricing-row pricing-row--total">
            <span><strong>Ukupno:</strong></span>
            <span><strong>{order.totalPrice.toFixed(2)} RSD</strong></span>
          </div>
        </div>

        <div className="order-details-actions">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/")}
          >
            Nazad na početnu
          </button>
          
          <InvoiceButton 
            orderId={order.id}
            orderStatus={order.status}
            variant="secondary"
            size="normal"
          >
             Račun
          </InvoiceButton>
          
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/restaurants/${order.restaurantId}/menu`)}
          >
            Pogledaj meni ponovo
          </button>
        </div>
      </div>
    </div>
  );
}
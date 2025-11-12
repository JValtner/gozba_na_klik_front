import React from "react";

const CourierOrderCard = ({ order, onStatusUpdate, isUpdating }) => {
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
    }).format(price);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PREUZIMANJE U TOKU":
        return {
          label: "Preuzimanje u toku",
          color: "status-badge--accepted",
          icon: "✅",
          description: "Porudžbina je prihvaćena i čeka preuzimanje",
        };
      case "DOSTAVA U TOKU":
        return {
          label: "Dostava u toku",
          color: "status-badge--in-delivery",
          icon: "🚚",
          description: "Porudžbina je u toku dostave",
        };
      case "ZAVRŠENO":
        return {
          label: "Završeno",
          color: "status-badge--completed",
          icon: "🎉",
          description: "Porudžbina je uspešno dostavljena",
        };
      default:
        return {
          label: status,
          color: "status-badge--unknown",
          icon: "❓",
          description: "Nepoznat status",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const canPickup = order.status === "PREUZIMANJE U TOKU";
  const canDeliver = order.status === "DOSTAVA U TOKU";

  return (
    <div className="courier-order-card">
      <div className="courier-order-card__header">
        <div className="order-info">
          <h2>Porudžbina #{order.orderId}</h2>
          <div className="order-meta">
            <span className="order-date">📅 {formatDate(order.orderDate)}</span>
            <span className={`status-badge ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
        <div className="order-total">
          <span className="total-label">Ukupno:</span>
          <span className="total-amount">{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      <div className="courier-order-card__content">
        <div className="order-details">
          <div className="detail-section">
            <h3>👤 Kupac</h3>
            <div className="detail-item">
              <span className="detail-label">Ime:</span>
              <span className="detail-value">{order.buyer.username}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>🏪 Restoran</h3>
            <div className="detail-item">
              <span className="detail-label">Naziv:</span>
              <span className="detail-value">{order.restaurant.name}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>📍 Adresa dostave</h3>
            <div className="detail-item">
              <span className="detail-label">Ulica:</span>
              <span className="detail-value">
                {order.address?.street ?? "Adresa nije dostupna"}
              </span>
            </div>
          </div>

          {order.customerNote && (
            <div className="detail-section">
              <h3>📝 Napomena kupca</h3>
              <div className="customer-note">
                <p>{order.customerNote}</p>
              </div>
            </div>
          )}
        </div>

        <div className="order-items">
          <h3>🛒 Stavke porudžbine</h3>
          <div className="items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Dostava:</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Ukupno:</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="courier-order-card__actions">
        {canPickup && (
          <button
            className="btn btn--primary btn--large"
            onClick={() => onStatusUpdate("DOSTAVA U TOKU")}
            disabled={isUpdating}
          >
            {isUpdating ? "⏳ Ažuriranje..." : "📦 Potvrdi preuzimanje"}
          </button>
        )}

        {canDeliver && (
          <button
            className="btn btn--success btn--large"
            onClick={() => onStatusUpdate("ZAVRŠENO")}
            disabled={isUpdating}
          >
            {isUpdating ? "⏳ Ažuriranje..." : "✅ Potvrdi dostavu"}
          </button>
        )}

        {!canPickup && !canDeliver && (
          <div className="no-actions">
            <p>Nema dostupnih akcija za ovaj status porudžbine</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourierOrderCard;

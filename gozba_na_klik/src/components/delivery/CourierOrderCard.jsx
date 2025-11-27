import React from "react";

const CourierOrderCard = ({ order, onStatusUpdate, isUpdating }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const formatAddress = (address) => {
    if (!address) return "Adresa nije dostupna";
    const parts = [
      address.street,
      address.city,
      address.entrance && `Ulaz ${address.entrance}`,
      address.floor && `Sprat ${address.floor}`,
      address.apartment && `Stan ${address.apartment}`,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const DELIVERY_STATUSES = [
    { key: "PREUZIMANJE U TOKU", label: "Preuzimanje u toku", icon: "📦" },
    { key: "DOSTAVA U TOKU", label: "Dostava u toku", icon: "🚚" },
    { key: "ZAVRŠENO", label: "Završeno", icon: "✅" },
  ];

  const getCurrentStatusIndex = () => {
    if (!order?.status) return -1;
    return DELIVERY_STATUSES.findIndex(
      (s) => s.key === order.status.toUpperCase()
    );
  };

  const currentStatusIndex = getCurrentStatusIndex();

  const canPickup = order.status === "PREUZIMANJE U TOKU";
  const canDeliver = order.status === "DOSTAVA U TOKU";

  return (
    <div className="courier-order-card">
      {/* Header */}
      <div className="courier-order-card__header">
        <h1>Porudžbina #{order.orderId}</h1>
        <p className="order-number">📅 {formatDate(order.orderDate)}</p>
      </div>

      {/* Progress Bar */}
      <div className="delivery-progress">
        <div className="delivery-progress__track">
          {DELIVERY_STATUSES.map((status, index) => {
            const isCompleted = currentStatusIndex >= index;
            const isCurrent = currentStatusIndex === index;
            const isUpcoming = currentStatusIndex < index;

            return (
              <div
                key={status.key}
                className={`delivery-progress__step ${
                  isCompleted ? "delivery-progress__step--completed" : ""
                } ${isCurrent ? "delivery-progress__step--current" : ""} ${
                  isUpcoming ? "delivery-progress__step--upcoming" : ""
                }`}
              >
                <div className="delivery-progress__step-icon">
                  {isCompleted && !isCurrent ? "✓" : status.icon}
                </div>
                <div className="delivery-progress__step-label">
                  {status.label}
                </div>
                {isCurrent && (
                  <div className="delivery-progress__step-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="delivery-progress__connector">
          {DELIVERY_STATUSES.map((_, index) => {
            const isCompleted = currentStatusIndex > index;
            return (
              <div
                key={index}
                className={`delivery-progress__connector-line ${
                  isCompleted
                    ? "delivery-progress__connector-line--completed"
                    : ""
                }`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="courier-order-card__content">
        {/* Left Column - Order Details */}
        <div className="courier-order-card__details">
          {/* Restaurant Info */}
          {order.restaurant && (
            <div className="info-card">
              <h2 className="info-card__title">Restoran</h2>
              <div className="info-card__content">
                <p className="info-card__name">{order.restaurant.name}</p>
                {order.restaurant.address && (
                  <p className="info-card__text">
                    📍 {order.restaurant.address}
                  </p>
                )}
                {order.restaurant.phone && (
                  <p className="info-card__text">📞 {order.restaurant.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Customer Info */}
          {order.buyer && (
            <div className="info-card">
              <h2 className="info-card__title">Kupac</h2>
              <div className="info-card__content">
                <p className="info-card__name">👤 {order.buyer.username}</p>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {order.address && (
            <div className="info-card">
              <h2 className="info-card__title">Adresa dostave</h2>
              <div className="info-card__content">
                <p className="info-card__text">
                  {formatAddress(order.address)}
                </p>
                {order.address.notes && (
                  <p className="info-card__text info-card__text--notes">
                    📝 {order.address.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="info-card">
              <h2 className="info-card__title">Stavke porudžbine</h2>
              <div className="info-card__content">
                <div className="order-items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item-tracking">
                      <div className="order-item-tracking__info">
                        <span className="order-item-tracking__quantity">
                          {item.quantity}x
                        </span>
                        <span className="order-item-tracking__name">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="info-card">
            <h2 className="info-card__title">Cena</h2>
            <div className="info-card__content">
              <div className="pricing-row">
                <span>Međuzbir:</span>
                <span>{formatPrice(order.subtotalPrice)}</span>
              </div>
              <div className="pricing-row">
                <span>Dostava:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="pricing-row pricing-row--total">
                <span>Ukupno:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <div className="info-card">
              <h2 className="info-card__title">Napomena</h2>
              <div className="info-card__content">
                <p className="info-card__text">{order.customerNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Map Placeholder */}
        <div className="courier-order-card__map">
          <div className="map-placeholder">
            <div className="map-placeholder__icon">🗺️</div>
            <p className="map-placeholder__text">Mapa će biti prikazana ovde</p>
            {order.address?.latitude && order.address?.longitude && (
              <p className="map-placeholder__coordinates">
                Koordinate: {order.address.latitude.toFixed(6)},{" "}
                {order.address.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="courier-order-card__actions">
        {canPickup && (
          <button
            className="btn btn--primary btn--large"
            onClick={() => onStatusUpdate("DOSTAVA U TOKU")}
            disabled={isUpdating}
          >
            {isUpdating ? "⏳ Ažuriranje..." : "📦 Preuzeo sam dostavu"}
          </button>
        )}

        {canDeliver && (
          <button
            className="btn btn--success btn--large"
            onClick={() => onStatusUpdate("ZAVRŠENO")}
            disabled={isUpdating}
          >
            {isUpdating ? "⏳ Ažuriranje..." : "✅ Predao sam dostavu"}
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

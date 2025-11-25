import React from "react";
import { useEffect, useState } from "react";
import { getActiveOrderStatus } from "../service/orderService";
import Spinner from "../spinner/Spinner";
import "../../styles/_order-tracking.scss";
import CourierMap from "../map/CourierMap";
import {
  startConnection,
  joinOrderGroup,
  onLocationUpdate,
  stopConnection,
  onOrderCompleted,
} from "../service/courierLocationService";

const OrderTrackingPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [courierLocation, setCourierLocation] = useState(null);

  const DELIVERY_STATUSES = [
    { key: "NA_CEKANJU", label: "Na čekanju", icon: "⏳" },
    { key: "PRIHVAĆENA", label: "Prihvaćena", icon: "✅" },
    { key: "PREUZIMANJE U TOKU", label: "Preuzimanje u toku", icon: "📦" },
    { key: "DOSTAVA U TOKU", label: "Dostava u toku", icon: "🚚" },
  ];

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getActiveOrderStatus();
      setOrder(data);

      // Ako nema aktivne porudžbine, obriši lokaciju i zaustavi SignalR
      if (!data) {
        setCourierLocation(null);
        stopConnection().catch(console.error);
      } else if (data.status === "DOSTAVA U TOKU" && data.deliveryPerson) {
        setCourierLocation({
          lat: data.deliveryPerson.latitude,
          lng: data.deliveryPerson.longitude,
        });
      }
    } catch (err) {
      console.error(err);
      setCourierLocation(null);
      setOrder(null);
      setError("Nemate aktivnih porudzbina.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order?.activeOrderId || order.status !== "DOSTAVA U TOKU") return;

    let isMounted = true;

    const initSignalR = async () => {
      try {
        await startConnection();
        await joinOrderGroup(order.activeOrderId);

        onLocationUpdate((lat, lng) => {
          if (isMounted) setCourierLocation({ lat, lng });
        });

        onOrderCompleted(() => {
          if (isMounted) {
            setCourierLocation(null);
            loadOrder(); // Ako više nema aktivne porudžbine, order će biti null
          }
          stopConnection().catch(console.error);
        });
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    initSignalR();

    return () => {
      isMounted = false;
      stopConnection().catch(console.error);
    };
  }, [order?.activeOrderId, order?.status]);

  useEffect(() => {
    loadOrder();

    // Auto-refresh svakih 10 sekundi
    const interval = setInterval(() => {
      loadOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentStatusIndex = () => {
    if (!order?.status) return -1;
    return DELIVERY_STATUSES.findIndex(
      (s) => s.key === order.status.toUpperCase()
    );
  };

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

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [
      address.street,
      address.city,
      address.entrance && `Ulaz ${address.entrance}`,
      address.floor && `Sprat ${address.floor}`,
      address.apartment && `Stan ${address.apartment}`,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (loading && !order) {
    return <Spinner />;
  }

  if (error && !order) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-page__container">
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-page__container">
        <div className="order-tracking-page__header">
          <h1>Praćenje dostave</h1>
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

        <div className="order-tracking-page__content">
          {/* Left Column - Order Details */}
          <div className="order-tracking-page__details">
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
                    <p className="info-card__text">
                      📞 {order.restaurant.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address */}
            {order.customerAddress && (
              <div className="info-card">
                <h2 className="info-card__title">Adresa dostave</h2>
                <div className="info-card__content">
                  <p className="info-card__text">
                    {formatAddress(order.customerAddress)}
                  </p>
                  {order.customerAddress.notes && (
                    <p className="info-card__text info-card__text--notes">
                      📝 {order.customerAddress.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Person */}
            {order.deliveryPerson && (
              <div className="info-card">
                <h2 className="info-card__title">Kurir</h2>
                <div className="info-card__content">
                  <p className="info-card__name">
                    🚴 {order.deliveryPerson.username}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            {order.orderItems && order.orderItems.length > 0 && (
              <div className="info-card">
                <h2 className="info-card__title">Stavke porudžbine</h2>
                <div className="info-card__content">
                  <div className="order-items-list">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-item-tracking">
                        <div className="order-item-tracking__info">
                          <span className="order-item-tracking__quantity">
                            {item.quantity}x
                          </span>
                          <span className="order-item-tracking__name">
                            {item.name}
                          </span>
                        </div>
                        {item.selectedAddons && (
                          <p className="order-item-tracking__addons">
                            {item.selectedAddons}
                          </p>
                        )}
                        <p className="order-item-tracking__price">
                          {item.totalPrice.toFixed(2)} RSD
                        </p>
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
                  <span>{order.subtotalPrice.toFixed(2)} RSD</span>
                </div>
                <div className="pricing-row">
                  <span>Dostava:</span>
                  <span>{order.deliveryFee.toFixed(2)} RSD</span>
                </div>
                <div className="pricing-row pricing-row--total">
                  <span>Ukupno:</span>
                  <span>{order.totalPrice.toFixed(2)} RSD</span>
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

            {/* Order Dates */}
            <div className="info-card">
              <h2 className="info-card__title">Informacije</h2>
              <div className="info-card__content">
                <p className="info-card__text">
                  <strong>Datum porudžbine:</strong>{" "}
                  {formatDate(order.orderDate)}
                </p>
                {order.estimatedDeliveryTime && (
                  <p className="info-card__text">
                    <strong>Procenjeno vreme dostave:</strong>{" "}
                    {formatDate(order.estimatedDeliveryTime)}
                  </p>
                )}
                {order.lastUpdated && (
                  <p className="info-card__text">
                    <strong>Poslednje ažuriranje:</strong>{" "}
                    {formatDate(order.lastUpdated)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Map Placeholder */}
          {courierLocation && (
            <div className="order-tracking-page__map">
              <CourierMap
                lat={courierLocation.lat}
                lng={courierLocation.lng}
                height="400px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { baseUrl } from "../../config/routeConfig";

const RestaurantBuyerCard = ({ restaurant }) => {
  const { role, userId } = useUser();
  
  if (!restaurant) return null;

  const {
    id,
    name,
    photoUrl,
    address,
    description,
    phone,
    isOpen,
    workSchedule,
    closedDates,
    createdAt,
    isSuspended,
    ownerId
  } = restaurant;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("sr-RS") : "";

  const isOwner = role === "RestaurantOwner" && 
    userId && 
    ownerId && 
    Number(userId) === Number(ownerId);

  const isDisabled = isSuspended && !isOwner;

  const cardContent = (
    <>
      {/* --- Image with overlay --- */}
      <div className="restaurant-card__image">
        {photoUrl ? (
          <img src={`${baseUrl}${photoUrl}`} alt={name} />
        ) : (
          <div className="restaurant-card__placeholder">
            <p>Bez slike</p>
          </div>
        )}
        <div className="restaurant-card__overlay">
          <h2 className="restaurant-card__title">{name}</h2>
        </div>
      </div>

      {/* --- Content --- */}
      <div className="restaurant-card__content">
        {address && (
          <p>
            <strong>Adresa:</strong> {address}
          </p>
        )}

        {description && (
          <p>
            <strong>Opis:</strong> {description}
          </p>
        )}

        {phone && (
          <p>
            <strong>Telefon:</strong> {phone}
          </p>
        )}

        {isSuspended && !isOwner && (
          <p>
            <strong>Status:</strong>{" "}
            <span className="status status--suspended" style={{ 
              backgroundColor: "#dc3545", 
              color: "white", 
              padding: "0.25rem 0.5rem", 
              borderRadius: "0.25rem",
              fontWeight: "bold"
            }}>
              ⚠️ Suspendovan
            </span>
          </p>
        )}
        
        {(!isSuspended || isOwner) && (
          <p>
            <strong>Status:</strong>{" "}
            {isOpen ? (
              <span className="status status--open">Otvoreno</span>
            ) : (
              <span className="status status--closed">Zatvoreno</span>
            )}
          </p>
        )}

        {workSchedule && (
          <p>
            <strong>Radno vreme:</strong>{" "}
            {workSchedule.openingTime} - {workSchedule.closingTime}
          </p>
        )}

        {closedDates?.length > 0 && (
          <p>
            <strong>Neradni dani:</strong>{" "}
            {closedDates
              .map((cd) => new Date(cd.date).toLocaleDateString("sr-RS"))
              .join(", ")}
          </p>
        )}

        {createdAt && (
          <p>
            <strong>Kreiran:</strong> {formatDate(createdAt)}
          </p>
        )}
      </div>
    </>
  );

  if (isDisabled) {
    return (
      <div className="restaurant-card" style={{ 
        opacity: 0.6, 
        cursor: "not-allowed",
        position: "relative"
      }}>
        {cardContent}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.5rem"
        }}>
          <div style={{
            backgroundColor: "#fff3cd",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "2px solid #ffc107",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#856404" }}>
              ⚠️ Restoran je suspendovan
            </p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#856404" }}>
              Nije dostupan za naručivanje
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/restaurants/${id}/menu`} className="restaurant-card">
      {cardContent}
    </Link>
  );
};

export default RestaurantBuyerCard;

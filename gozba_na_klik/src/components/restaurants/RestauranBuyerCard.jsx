import React from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config/routeConfig";

const RestaurantBuyerCard = ({ restaurant }) => {
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
    createdAt
  } = restaurant;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("sr-RS") : "";

  return (
    <Link to={`/restaurants/${id}/menu`} className="restaurant-card">
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

        <p>
          <strong>Status:</strong>{" "}
          {isOpen ? (
            <span className="status status--open">Otvoreno</span>
          ) : (
            <span className="status status--closed">Zatvoreno</span>
          )}
        </p>

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
    </Link>
  );
};

export default RestaurantBuyerCard;

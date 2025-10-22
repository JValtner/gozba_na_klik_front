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
    <Link to={`/restaurants/${restaurant.id}/menu`} className="dashboard__card restaurant-card-link">
      {photoUrl && (
        <img
          src={`${baseUrl}${photoUrl}`}
          alt={name}
          className="restaurant-image"
        />
      )}

      <h2>{name}</h2>

      {address && <p><strong>Adresa:</strong> {address}</p>}
      {description && <p><strong>Opis:</strong> {description}</p>}
      {phone && <p><strong>Telefon:</strong> {phone}</p>}

      <p>
        <strong>Status:</strong>{" "}
        {isOpen ? <span className="open">Otvoreno</span> : <span className="closed">Zatvoreno</span>}
      </p>

      {workSchedule && (
        <p><strong>Radno vreme:</strong> {workSchedule.openingTime} - {workSchedule.closingTime}</p>
      )}

      {closedDates && closedDates.length > 0 && (
        <p><strong>Neradni dani:</strong> {closedDates.map(cd => new Date(cd.date).toLocaleDateString("sr-RS")).join(", ")}</p>
      )}

      {createdAt && <p><strong>Kreiran:</strong> {formatDate(createdAt)}</p>}
    </Link>
  );
};

export default RestaurantBuyerCard;
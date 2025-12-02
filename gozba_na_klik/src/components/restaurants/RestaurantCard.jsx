import React, { useState } from "react";
import { deleteRestaurant } from "../service/restaurantService";
import { useNavigate } from "react-router-dom";
import { showToast, showConfirm } from "../utils/toast";

const RestaurantCard = ({ restaurant, onEdit, onView, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    showConfirm(
      `Da li ste sigurni da želite da obrišete restoran "${restaurant.name}"?`,
      async () => {
        try {
          setIsDeleting(true);
          await deleteRestaurant(restaurant.id);
          showToast.success("Restoran je uspešno obrisan!");
          onRefresh();
        } catch (err) {
          console.error("Greška pri brisanju restorana:", err);
          showToast.error("Greška pri brisanju restorana. Pokušajte ponovo.");
        } finally {
          setIsDeleting(false);
        }
      }
    );
  };

  const handleMenu = () => {
    navigate(`/restaurants/${restaurant.id}/menu`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS");
  };

  return (
    <div className="restaurant-card">
      <div className="restaurant-card__image">
        {restaurant.photoUrl ? (
          <img src={`http://localhost:5065${restaurant.photoUrl}`}
            alt={restaurant.name}
            onError={(e) => {
              e.target.src = "/default-restaurant.png";
            }}
          />
        ) : (
          <div className="restaurant-card__placeholder">
            <span>📷</span>
            <p>Nema fotografije</p>
          </div>
        )}
      </div>

      <div className="restaurant-card__content">
        <div className="restaurant-card__header">
          <h3 className="restaurant-card__title">{restaurant.name}</h3>
          <div className="restaurant-card__meta">
            <span className="restaurant-card__date">
              Kreiran: {formatDate(restaurant.createdAt)}
            </span>
          </div>
        </div>

        {restaurant.description && (
          <p className="restaurant-card__description">
            {restaurant.description.length > 100
              ? `${restaurant.description.substring(0, 100)}...`
              : restaurant.description
            }
          </p>
        )}

        <div className="restaurant-card__details">
          <div className="detail-item">
            <span className="detail-label">Adresa:</span>
            <span className="detail-value">{restaurant.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Telefon:</span>
            <span className="detail-value">{restaurant.phoneNumber}</span>
          </div>
          {restaurant.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{restaurant.email}</span>
            </div>
          )}
        </div>

        <div className="restaurant-card__actions">
          <button
            className="btn btn--secondary btn--small"
            onClick={onView}
            title="Prikaži detalje"
          >
            Prikaži
          </button>
          <button
            className="btn btn--primary btn--small"
            onClick={onEdit}
            title="Uredi restoran"
          >
            Uredi
          </button>
          <button
            className="btn btn--danger btn--small"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Obriši restoran"
          >
            {isDeleting ? "Brisanje..." : "Obriši"}
          </button>
          <button
            className="btn btn--secondary btn--small"
            onClick={handleMenu}
            title="Jelovnik"
          >
            Jelovnik
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
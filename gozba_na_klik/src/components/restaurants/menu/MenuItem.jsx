import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../../../config/routeConfig";
import { useUser } from "../../users/UserContext";
import { getUserById } from "../../service/userService";

const MenuItem = ({ meal, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { userId, role } = useUser();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightedId = parseInt(params.get("highlight"));
  const isHighlighted = highlightedId === meal.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const data = await getUserById(userId);
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleDetails = () => {
    navigate(`/restaurants/${meal.restaurant.id}/menu/${meal.id}`);
  };

  const handleOrder = () => {
    // navigate(`/restaurants/${meal.restaurant.id}/menu/${meal.id}/order`);
  };

  const hasSensitiveAllergen = meal.alergens?.some(a =>
    userData?.userAlergens?.some(ua => ua.id === a.id)
  );

  return (
    <div
      className={`meal-card 
      ${hasSensitiveAllergen ? "meal-card--alert" : ""} 
      ${isHighlighted ? "meal-card--highlight" : ""}`}
    >
      {/* --- Image Section --- */}
      <div className="meal-card__image">
        {meal.imagePath ? (
          <img src={`${baseUrl}${meal.imagePath}`} alt={meal.name} />
        ) : (
          <div className="meal-card__placeholder">
            <p>No Image</p>
          </div>
        )}
        <div className="meal-card__overlay">
          <h3 className="meal-card__title">{meal.name}</h3>
          <p className="meal-card__price">{meal.price.toFixed(2)} €</p>
        </div>
      </div>

      <div className="meal-card__content">
        {/* --- Addons --- */}
        {meal.addons?.length > 0 && (
          <div className="meal-card__addons">
            <h4>Dodaci</h4>
            <ul>
              {meal.addons.map(addon => (
                <li key={addon.id}>{addon.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* --- Allergens --- */}
        {meal.alergens?.length > 0 && (
          <div className="meal-card__alergens">
            <h4>Alergeni</h4>
            <ul>
              {meal.alergens.map(a => {
                const isUserSensitive = userData?.userAlergens?.some(
                  ua => ua.id === a.id
                );
                return (
                  <li
                    key={a.id}
                    className={isUserSensitive ? "alergen--alert" : ""}
                  >
                    {a.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* --- Actions --- */}
        <div className="meal-card__actions">
          {role === "RestaurantOwner" && (
            <>
              <button className="btn btn--primary" onClick={handleDetails}>
                Izmeni detalje
              </button>
              
              {onDelete && (
                <button className="btn btn--danger" onClick={() => onDelete(meal.id)}>
                  Obriši
                </button>
              )}
            </>
          )}

          {role === "Buyer" && (
            <button className="btn btn--primary" onClick={handleOrder}>
              Poruči
            </button>
          )}

          {role === "Guest" && (
            <p className="login-hint">Prijavite se da biste poručili</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;

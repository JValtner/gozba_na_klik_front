import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../../../config/routeConfig";
import { useUser } from "../../users/UserContext";
import { getUserById } from "../../service/userService";
import { addToCart } from "../../orders/AddToCart";
import MealOrderModal from "../meal/MealOrderModal";

const MenuItem = ({ meal, onEdit, onDelete, isOwner }) => {
  const navigate = useNavigate();
  const { userId, role } = useUser();
  const [userData, setUserData] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
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

  const handleOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOrderModal(true);
  };

  const handleAddToCartComplete = (meal, quantity, selectedAddons) => {
    addToCart(meal.restaurant.id, meal, quantity, selectedAddons);
    setShowOrderModal(false);
    
    // Proveri da li toast postoji
    if (typeof toast !== 'undefined' && toast.success) {
      toast.success(`${meal.name} je dodat u korpu!`);
    }
  };

  const hasSensitiveAllergen = meal.alergens?.some(a =>
    userData?.userAlergens?.some(ua => ua.id === a.id)
  );

  return (
    <>
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
            {isOwner && (
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

            {(role === "User" || role === "Buyer") && (
              <button className="btn btn--primary" onClick={handleOrder}>
                Poruči
              </button>
            )}

            {(!role || (role !== "User" && role !== "Buyer")) && (
              <p className="login-hint">Prijavite se da biste poručili</p>
            )}
          </div>
        </div>
      </div>

      {showOrderModal && (
        <MealOrderModal
          meal={meal}
          onClose={() => setShowOrderModal(false)}
          onAddToCart={handleAddToCartComplete}
        />
      )}
    </>
  );
};

export default MenuItem;
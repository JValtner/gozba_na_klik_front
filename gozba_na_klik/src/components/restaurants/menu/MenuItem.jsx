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
    //navigate(`/restaurants/${meal.restaurant.id}/menu/${meal.id}/order`);
  };

  // ✅ Check if this meal contains allergens that match the user’s allergens
  const hasSensitiveAllergen = meal.alergens?.some(a =>
    userData?.userAlergens?.some(ua => ua.id === a.id)
  )

  console.log("Meal:", meal.name, meal.alergens);
  console.log("User alergens:", userData?.alergens);
  return (
    <div className={`meal-card 
    ${hasSensitiveAllergen ? "meal-card--alert" : ""} 
    ${isHighlighted ? "meal-card--highlight" : ""}`}
    >

      {/* --- Image --- */}
      <div className="meal-card__image">
        <img
          src={`${baseUrl}${meal.imagePath}`}
          alt={meal.name}
          onError={(e) => (e.target.src = "")}
        />
        <div className="meal-card__overlay">
          <h3>{meal.name}</h3>
          <p>{meal.price.toFixed(2)} €</p>
        </div>
      </div>

      {/* --- Addons --- */}
      {meal.addons?.length > 0 && (
        <div className="meal-card__addons">
          <h4>Dodaci</h4>
          <ul>
            {meal.addons.map((addon) => (
              <li key={addon.id}>{addon.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Alergens --- */}
      {meal.alergens?.length > 0 && (
        <div className="meal-card__alergens">
          <h4>Alergeni</h4>
          <ul>
            {meal.alergens.map((a) => {
              const isUserSensitive = userData?.alergens?.some(
                (ua) => ua.id === a.id
              );

              return (
                <li
                  key={a.id}
                  style={
                    isUserSensitive
                      ? { color: "red", fontWeight: "bold" }
                      : undefined
                  }
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
            <button onClick={handleDetails}>Detalji</button>
            {onEdit && <button onClick={() => onEdit(meal)}>Izmeni</button>}
            {onDelete && (
              <button onClick={() => onDelete(meal.id)} className="danger">
                Obriši
              </button>
            )}
          </>
        )}

        {role === "Buyer" && <button onClick={handleOrder}>Poruči</button>}

        {role === "Guest" && (
          <p className="login-hint">Prijavite se da biste poručili</p>
        )}
      </div>
    </div>
  );
};

export default MenuItem;

import React from "react"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../../../config/routeConfig"

const MenuItem = ({ meal, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleDetails = () => {
    navigate(`/restaurants/${meal.restaurant.id}/menu/${meal.id}`)
  }

  return (
    <div className="meal-card">
      {/* --- Image with overlay --- */}
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
          <h4>Addons</h4>
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
          <h4>Alergens</h4>
          <ul>
            {meal.alergens.map((a) => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Details button --- */}
      <button className="btn btn--success btn--small" onClick={handleDetails}>
        Details
      </button>
    </div>
  )
}

export default MenuItem

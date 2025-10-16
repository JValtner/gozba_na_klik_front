import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMealById } from "../../service/menuService"
import Spinner from "../../spinner/Spinner"
import { baseUrl } from "../../../config/routeConfig"
import DisplayAlergens from "../alergen/displayAlergens"
import DisplayAddons from "../addOn/displayAddons"

export default function MealDetails() {
  const { id: restaurantId, mealId } = useParams()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadMeal = async () => {
      const data = await getMealById(mealId)
      setMeal(data)
      setLoading(false)
    }
    loadMeal()
  }, [mealId])

  if (loading) return <Spinner />
  if (!meal) return <p>Meal not found.</p>

  return (
    <div className="meal-details">
      {/* --- Image --- */}
      <div className="meal-details__image">
        <img
          src={`${baseUrl}${meal.imagePath}`}
          alt={meal.name}
          onError={(e) => (e.target.src = "")}
        />
      </div>

      {/* --- Name & Price --- */}
      <div className="meal-details__header">
        <h1>{meal.name}</h1>
        <h2>{meal.price.toFixed(2)} €</h2>
      </div>

      {/* --- Description --- */}
      <p className="meal-details__description">{meal.description}</p>

      {/* --- Addons & Alergens columns --- */}
      <div className="meal-details__columns">
        <div className="column">
          <h3>Addons</h3>
          <DisplayAddons mealId={mealId} /> 
        </div>

        <div className="column">
          <h3>Alergens</h3>
          <DisplayAlergens mealId={mealId} />
        </div>
      </div>

      {/* --- Buttons --- */}
      <div className="meal-details__actions">
        <button
          className="btn btn--primary"
          onClick={() => navigate(`/restaurants/${restaurantId}/menu/${mealId}/edit`)}
        >
          Edit
        </button>
        <button className="btn btn--danger" onClick={() => navigate(-1)}>
          Delete
        </button>
      </div>
    </div>
  )
}

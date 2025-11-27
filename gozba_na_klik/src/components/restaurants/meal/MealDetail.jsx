import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMealById } from "../../service/menuService"
import { getRestaurantById } from "../../service/restaurantsService"
import { useUser } from "../../users/UserContext"
import Spinner from "../../spinner/Spinner"
import { baseUrl } from "../../../config/routeConfig"
import DisplayAlergens from "../alergen/displayAlergens"
import DisplayAddons from "../addOn/displayAddons"

export default function MealDetails() {
  const { id: restaurantId, mealId } = useParams()
  const navigate = useNavigate()
  const { userId, role } = useUser()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const mealData = await getMealById(mealId)
        setMeal(mealData)

        if (role === "RestaurantOwner" && userId && restaurantId) {
          const restaurantData = await getRestaurantById(restaurantId)
          const userIsOwner = restaurantData.ownerId && 
                             Number(userId) === Number(restaurantData.ownerId)
          setIsOwner(userIsOwner)
        }
      } catch (err) {
        console.error("Greška pri učitavanju:", err)
      } finally {
        setLoading(false)
      }
    }
    loadMeal()
  }, [mealId, restaurantId, userId, role])

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
        {isOwner && (
          <button
            className="btn btn--secondary"
            onClick={() => navigate(`/restaurants/${restaurantId}/menu/${mealId}/edit`)}
          >
            Edit
          </button>
        )}
        <button className="btn btn--secondary" onClick={() => navigate(`/restaurants/${restaurantId}/menu`)}>
          ← Nazad
        </button>
      </div>
    </div>
  )
}

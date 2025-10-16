import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "../../users/UserContext"
import { getRestaurantById } from "../../service/restaurantsService"
import { getMealsByRestaurantId } from "../../service/menuService"
import Spinner from "../../spinner/Spinner"
import MenuItem from "./menuItem"

const Menu = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId } = useUser()

  const [restaurant, setRestaurant] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const restaurantData = await getRestaurantById(id)
        setRestaurant(restaurantData)

        const mealsData = await getMealsByRestaurantId(restaurantData.id)
        setMeals(mealsData)
      } catch (err) {
        console.error("Greška:", err)
        setError("Greška pri učitavanju jelovnika.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const onEdit = (mealId) => navigate(`/restaurants/${id}/menu/${mealId}/edit`)

  const onDelete = async (mealId) => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovo jelo?")) {
      console.log("Deleting meal:", mealId)
      setMeals((prev) => prev.filter((m) => m.id !== mealId))
    }
  }
  const handleNewMeal = () => {
  if (!restaurant) return
  navigate(`/restaurants/${restaurant.id}/menu/new`)
}

  if (loading) return <Spinner />
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div className="menu-page">
      {/* --- Restaurant Header --- */}
      <div className="restaurant-header">
        <div className="restaurant-image-wrapper">
          <img
            src={`http://localhost:5065${restaurant.photoUrl}`}
            alt={restaurant.name}
            onError={(e) => (e.target.src = "")}
          />
          <div className="restaurant-name-overlay">
            <h1>{restaurant.name} Jelovnik</h1>
          </div>
        </div>
      </div>
      {/* --- New meal btn --- */}
      <div className="restaurant-meal-new">
        <button className="new-meal-btn" onClick={handleNewMeal}>Add meal</button>
      </div>
      {/* --- Meals Section --- */}
      <div className="meals-section">
        <h2>Jelovnik</h2>
        {meals.length === 0 ? (
          <p>Nema dostupnih jela.</p>
        ) : (
          <div className="meals-grid">
            {meals.map((meal) => (
              <MenuItem key={meal.id} meal={meal} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu

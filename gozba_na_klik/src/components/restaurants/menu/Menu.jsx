import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "../../users/UserContext"
import { getRestaurantById } from "../../service/restaurantsService"
import { getMealsByRestaurantId } from "../../service/menuService"
import Spinner from "../../spinner/Spinner"
import MenuItem from "../../restaurants/menu/MenuItem"
import { baseUrl } from "../../../config/routeConfig";
import { getCartItemCount } from "../../orders/AddToCart";


const Menu = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId, role } = useUser()

  const [restaurant, setRestaurant] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const restaurantData = await getRestaurantById(id)
        setRestaurant(restaurantData)

        // Check if current user is the owner of this restaurant
        const userIsOwner = role === "RestaurantOwner" &&
          userId &&
          restaurantData.ownerId &&
          Number(userId) === Number(restaurantData.ownerId)
        setIsOwner(userIsOwner)

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
  }, [id, userId, role])

  useEffect(() => {
    const updateCartCount = () => {
      if (restaurant) {
        const count = getCartItemCount(restaurant.id);
        setCartItemCount(count);
      }
    };

    updateCartCount();

    const interval = setInterval(updateCartCount, 2000);
    return () => clearInterval(interval);
  }, [restaurant]);

  const handleGoToCart = () => {
    if (!restaurant) {
      console.error("Restaurant nije još učitan!");
      return;
    }

    if (cartItemCount === 0) {
      alert("Korpa je prazna.");
      return;
    }

    navigate(`/restaurants/${restaurant.id}/order-summary`);
  };

  const onEdit = (meal) => navigate(`/restaurants/${id}/menu/${meal.id}/edit`)

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
            src={`${baseUrl}${restaurant.photoUrl}`}
            alt={restaurant.name}
            onError={(e) => (e.target.src = "")}
          />
          <div className="restaurant-name-overlay">
            <h1>{restaurant.name} Jelovnik</h1>
          </div>
        </div>
      </div>
      {/* --- New meal btn --- */}
      {isOwner && (
        <div className="restaurant-meal-new">
          <button className="btn btn--primary" onClick={handleNewMeal}>Add meal</button>
        </div>
      )}

      {/* --- Cart Button for Users --- */}
      {(role === "User" || role === "Buyer") && (
        <div className="restaurant-cart-button">
          <button
            className="cart-btn"
            onClick={handleGoToCart}
            disabled={cartItemCount === 0}
          >
            🛒 Korpa ({cartItemCount})
          </button>
        </div>
      )}

      {/* --- Meals Section --- */}
      <div className="meals-section">
        <h2>Jelovnik</h2>
        {meals.length === 0 ? (
          <p>Nema dostupnih jela.</p>
        ) : (
          <div className="meals-grid">
            {meals.map((meal) => (
              <MenuItem key={meal.id} meal={meal} onEdit={onEdit} onDelete={onDelete} isOwner={isOwner} />
            ))}
          </div>
        )}
      </div>
      <div>
        <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>
          ← Nazad
        </button>
      </div>

    </div>
  )
}

export default Menu
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MealForm from "./MealForm"
import { getMealById } from "../../service/menuService"
import { getRestaurantById } from "../../service/restaurantsService"
import { useUser } from "../../users/UserContext"
import Spinner from "../../spinner/Spinner"
import { showToast } from "../../utils/toast"

export default function EditMeal() {
  const { id: restaurantId, mealId } = useParams()
  const navigate = useNavigate()
  const { userId, role } = useUser()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const mealData = await getMealById(mealId)
        setMeal(mealData)

        const restaurantData = await getRestaurantById(restaurantId)
        const userIsOwner = role === "RestaurantOwner" && 
                           userId && 
                           restaurantData.ownerId && 
                           Number(userId) === Number(restaurantData.ownerId)
        
        if (!userIsOwner) {
          showToast.error("Nemate dozvolu da menjate jela ovog restorana.")
          navigate(`/restaurants/${restaurantId}/menu`)
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error("Greška pri učitavanju:", err)
        navigate(`/restaurants/${restaurantId}/menu`)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [mealId, restaurantId, userId, role, navigate])

  if (loading) return <Spinner />
  if (!isAuthorized) return null

  return <MealForm meal={meal} restaurantId={restaurantId} />
}

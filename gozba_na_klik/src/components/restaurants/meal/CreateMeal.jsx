import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRestaurantById } from "../../service/restaurantsService"
import { useUser } from "../../users/UserContext"
import MealForm from "./MealForm"
import Spinner from "../../spinner/Spinner"
import { showToast } from "../../utils/toast"

export default function CreateMeal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId, role } = useUser()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const restaurantData = await getRestaurantById(id)
        const userIsOwner = role === "RestaurantOwner" && 
                           userId && 
                           restaurantData.ownerId && 
                           Number(userId) === Number(restaurantData.ownerId)
        
        if (!userIsOwner) {
          showToast.error("Nemate dozvolu da dodajete jela u ovaj restoran.")
          navigate(`/restaurants/${id}/menu`)
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error("Greška pri učitavanju:", err)
        navigate(`/restaurants/${id}/menu`)
      } finally {
        setLoading(false)
      }
    }
    checkAuthorization()
  }, [id, userId, role, navigate])

  if (loading) return <Spinner />
  if (!isAuthorized) return null

  return (
    <div className="create-meal-page">
      <MealForm restaurantId={id} />
    </div>
  )
}

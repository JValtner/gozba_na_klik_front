import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MealForm from "./MealForm"
import { getMealById } from "../../service/menuService"
import Spinner from "../../spinner/Spinner"

export default function EditMeal() {
  const { id: restaurantId, mealId } = useParams()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMeal = async () => {
      const data = await getMealById(mealId)
      setMeal(data)
      setLoading(false)
    }
    loadMeal()
  }, [mealId])

  if (loading) return <Spinner />

  return <MealForm meal={meal} restaurantId={restaurantId} />
}

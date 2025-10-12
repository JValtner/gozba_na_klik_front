import React from "react"
import { useParams } from "react-router-dom"
import MealForm from "./MealForm"

export default function CreateMeal() {
  const { restaurantId } = useParams()

  return (
    <div className="create-meal-page">
      <MealForm restaurantId={restaurantId} />
    </div>
  )
}

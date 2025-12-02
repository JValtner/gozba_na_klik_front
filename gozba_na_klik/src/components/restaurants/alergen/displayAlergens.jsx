import React, { useState, useEffect } from "react"
import {
  getAlergensByMealId,
  getAllAlergens,
  addAlergenToMeal,
  removeAlergenFromMeal,
} from "../../service/alergenService"
import Spinner from "../../spinner/Spinner"
import { showToast } from "../../utils/toast"

export default function DisplayAlergens({ mealId }) {
  const [assignedAlergens, setAssignedAlergens] = useState([])
  const [available, setAvailable] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusMsg, setStatusMsg] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Fetch assigned + all allergens
        const mealAlergens = await getAlergensByMealId(mealId)
        const allAlergens = await getAllAlergens()

        setAssignedAlergens(mealAlergens)

        // Filter out already assigned
        const unassigned = allAlergens.filter(
          (a) => !mealAlergens.some((x) => x.id === a.id)
        )
        setAvailable(unassigned)
      } catch (err) {
        console.error(err)
        setError("Failed to load allergens.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mealId])

  const handleAdd = async (alergenId) => {
    try {
      await addAlergenToMeal(mealId, alergenId)
      const alergen = available.find((a) => a.id === alergenId)
      setAssignedAlergens((prev) => [...prev, alergen])
      setAvailable((prev) => prev.filter((a) => a.id !== alergenId))
    } catch (err) {
      console.error(err)
      showToast.error("Failed to add allergen.")
    }
    finally {
      setStatusMsg("Allergen succesfully added.")
      setTimeout(() => setStatusMsg(""), 3000)
    }
  }

  const handleRemove = async (alergenId) => {
    try {
      await removeAlergenFromMeal(mealId, alergenId)
      const alergen = assignedAlergens.find((a) => a.id === alergenId)
      setAvailable((prev) => [...prev, alergen])
      setAssignedAlergens((prev) => prev.filter((a) => a.id !== alergenId))
    } catch (err) {
      console.error(err)
      showToast.error("Failed to remove allergen.")
    }
    finally {
      setStatusMsg("Allergen succesfully removed.")
      setTimeout(() => setStatusMsg(""), 3000)
    }
  }

  if (loading) return <Spinner />
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <>
      <div className="status-msg">
        {statusMsg && <p style={{ color: "green" }}>{statusMsg}</p>}
      </div>
      <div className="alergens-page">
        <div className="alergen-column">
          <h3>Assigned Allergens</h3>
          {assignedAlergens.length === 0 ? (
            <p>No allergens assigned to this meal.</p>
          ) : (
            <ul className="alergen-list">
              {assignedAlergens.map((a) => (
                <li key={a.id}>
                  {a.name}
                  <button
                    className="btn btn--danger"
                    onClick={() => handleRemove(a.id)}
                  >
                    −
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="alergen-column">
          <h3>Available Allergens</h3>
          {available.length === 0 ? (
            <p>All allergens are already assigned.</p>
          ) : (
            <ul className="alergen-list">
              {available.map((a) => (
                <li key={a.id}>
                  {a.name}
                  <button
                    className="btn btn--primary"
                    onClick={() => handleAdd(a.id)}
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

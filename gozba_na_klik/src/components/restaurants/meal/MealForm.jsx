import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { createMeal, updateMeal } from "../../service/menuService"
import { validateFile } from "../../service/fileService"

export default function MealForm({ meal = null, restaurantId: propRestaurantId }) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const params = useParams()

  const restaurantId = propRestaurantId || params.id

  const isEdit = Boolean(meal)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: meal || {
      name: "",
      description: "",
      price: "",
      mealImage: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError("")

      const mealData = new FormData()

      if (data.mealImage?.[0]) {
        mealData.append("mealImage", data.mealImage[0])
      }
      mealData.append("name", data.name)
      mealData.append("description", data.description)
      mealData.append("price", data.price)
      mealData.append("restaurantId", restaurantId)

      if (isEdit) {
        await updateMeal(meal.id, mealData)
        alert("Jelo je uspešno ažurirano!")
      } else {
        await createMeal(mealData)
        alert("Jelo je uspešno dodato!")
      }

      navigate(`/restaurants/${restaurantId}/menu`)
    } catch (err) {
      console.error("Greška pri čuvanju jela:", err)
      setError(err.response?.data?.message || "Došlo je do greške. Pokušajte ponovo.")
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleCancel = () => {
    navigate(`/restaurants/${restaurantId}/menu`)
  }

  return (
    <div className="meal-form-page">
      <div className="meal-form__container">
        <div className="meal-form__header">
          <h1>{isEdit ? "Uredi jelo" : "Dodaj novo jelo"}</h1>
          <p>Unesite detalje o jelu</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="meal-form">
          {error && <p className="form-error global-error">{error}</p>}

          {/* Naziv */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Naziv jela *</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Naziv jela je obavezan",
                maxLength: { value: 100, message: "Naziv ne može biti duži od 100 karaktera" },
              })}
              className="form-input"
              placeholder="Unesite naziv jela"
              disabled={isSubmitting}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          {/* Opis */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Opis</label>
            <textarea
              id="description"
              {...register("description", {
                maxLength: { value: 500, message: "Opis ne može biti duži od 500 karaktera" },
              })}
              className="form-textarea"
              placeholder="Kratak opis jela..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          {/* Cena */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">Cena (€)*</label>
            <input
              type="number"
              step="0.01"
              id="price"
              {...register("price", {
                required: "Cena je obavezna",
                min: { value: 0, message: "Cena mora biti pozitivna" },
              })}
              className="form-input"
              placeholder="Unesite cenu jela"
              disabled={isSubmitting}
            />
            {errors.price && <p className="form-error">{errors.price.message}</p>}
          </div>

          {/* Slika */}
          <div className="form-group">
            <label htmlFor="mealImage" className="form-label">Upload slike</label>
            <input
              type="file"
              id="mealImage"
              {...register("mealImage", {
                validate: {
                  fileCheck: (files) => {
                    const file = files?.[0];
                    const error = validateFile(file);
                    return error || true;
                  },
                },
              })}
              className="form-input"
              placeholder=""
              disabled={isSubmitting}
            />
            {errors.mealImage && <p className="form-error">{errors.mealImage.message}</p>}
          </div>

          {/* Dugmad */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Čuvanje..." : isEdit ? "Sačuvaj izmene" : "Dodaj jelo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

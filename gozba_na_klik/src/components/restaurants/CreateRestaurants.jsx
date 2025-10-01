import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "../users/UserContext";
import { createRestaurant } from "../service/restaurantService";

export default function CreateRestaurant() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");

      const restaurantData = {
        ...data,
        ownerId: userId,
      };

      const newRestaurant = await createRestaurant(restaurantData);
      
      alert("Restoran je uspešno kreiran!");
      navigate("/restaurants/dashboard");
    } catch (err) {
      console.error("Greška pri kreiranju restorana:", err);
      setError(err.response?.data?.message || "Greška pri kreiranju restorana. Pokušajte ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/restaurants/dashboard");
  };

  return (
    <div className="create-restaurant">
      <div className="create-restaurant__container">
        <div className="create-restaurant__header">
          <h1>Kreiraj novi restoran</h1>
          <p>Unesite osnovne informacije o vašem restoranu</p>
        </div>

        <div className="create-restaurant__form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="restaurant-form">
            
            {error && (
              <div className="error-message">
                <p className="error-message__text">{error}</p>
              </div>
            )}

            {/* Naziv */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Naziv restorana *
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { 
                  required: "Naziv restorana je obavezan",
                  maxLength: { value: 100, message: "Naziv ne može biti duži od 100 karaktera" }
                })}
                className="form-input"
                placeholder="Unesite naziv restorana"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            {/* Opis */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Opis restorana
              </label>
              <textarea
                id="description"
                {...register("description", {
                  maxLength: { value: 500, message: "Opis ne može biti duži od 500 karaktera" }
                })}
                className="form-textarea"
                placeholder="Kratko opišite vaš restoran..."
                rows={4}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>

            {/* Adresa */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Adresa *
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { 
                  required: "Adresa je obavezna",
                  maxLength: { value: 200, message: "Adresa ne može biti duža od 200 karaktera" }
                })}
                className="form-input"
                placeholder="Unesite adresu restorana"
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="form-error">{errors.address.message}</p>
              )}
            </div>

            {/* Telefon */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Broj telefona *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phone", { 
                  required: "Broj telefona je obavezan",
                  maxLength: { value: 20, message: "Broj telefona ne može biti duži od 20 karaktera" }
                })}
                className="form-input"
                placeholder="+381 21 123 456"
                disabled={isSubmitting}
              />
              {errors.phoneNumber && (
                <p className="form-error">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email adresa
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Unesite validan email"
                  },
                  maxLength: { value: 100, message: "Email ne može biti duži od 100 karaktera" }
                })}
                className="form-input"
                placeholder="restoran@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
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
                {isSubmitting ? "Kreiranje..." : "Kreiraj restoran"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
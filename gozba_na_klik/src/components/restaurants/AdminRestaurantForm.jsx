import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getAllRestaurantOwners } from "../service/userService";
import {
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
} from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";

const AdminRestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      ownerId: "",
    },
  });

  useEffect(() => {
    const loadOwners = async () => {
      setLoading(true);
      try {
        const data = await getAllRestaurantOwners();
        setOwners(data);
      } catch {
        setError("Greška pri učitavanju vlasnika. Pokušajte ponovo..");
      } finally {
        setLoading(false);
      }
    };
    loadOwners();
  }, []);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const restaurant = await getRestaurantById(id);
        reset({
          name: restaurant.name,
          ownerId: restaurant.ownerId,
        });
      } catch {
        setError("Greška pri učitavanju restorana. Pokušajte ponovo..");
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [id, reset]);

  const onSubmit = async (restaurant) => {
    setLoading(true);
    try {
      if (id) {
        await updateRestaurant(Number(id), restaurant);
      } else {
        await createRestaurant(restaurant);
      }
      navigate("/admin-restaurants");
    } catch {
      setError("Greška pri čuvanju restorana. Pokušajte ponovo..");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="edit-restaurant">
      <div className="edit-restaurant__container">
        <div className="edit-restaurant__header">
          <h1>{id ? "Izmeni Restoran" : "Dodaj Restoran"}</h1>
        </div>

        {error && <p className="error-span show">{error}</p>}

        <form className="restaurant-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              {...register("name", { required: "Naziv je obavezno polje." })}
              placeholder="Naziv restorana"
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Vlasnik</label>
            <select
              id="ownerId"
              className="form-input"
              {...register("ownerId", {
                required: "Morate odabrati vlasnika restorana",
                valueAsNumber: true,
              })}
            >
              <option value="" disabled hidden>
                Izaberite vlasnika restorana
              </option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.username}
                </option>
              ))}
            </select>
            {errors.ownerId && (
              <span className="error-msg">{errors.ownerId.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Čuvanje..." : id ? "Sačuvaj" : "Dodaj"}
            </button>
            <button
              className="btn btn--secondary"
              type="button"
              onClick={() => navigate("/admin-restaurants")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRestaurantForm;

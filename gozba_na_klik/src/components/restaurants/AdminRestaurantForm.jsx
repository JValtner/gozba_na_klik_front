import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getAllRestaurantOwners } from "../service/userService";
import {
  createRestaurant,
  getRestaurantById,
  updateRestaurantByAdmin,
  getRestaurantSuspension,
} from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";

const AdminRestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState([]);
  const [suspension, setSuspension] = useState(null);

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
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

        try {
          const suspensionData = await getRestaurantSuspension(id);
          setSuspension(suspensionData);
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Greška pri učitavanju suspenzije:", err);
          }
        }
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
        await updateRestaurantByAdmin(Number(id), restaurant);
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
          <h1>{id ? "Uredi Restoran" : "Dodaj Restoran"}</h1>
        </div>

        {error && <p className="error-span show">{error}</p>}

        {suspension && (
          <div className="suspension-alert">
            <h3>⚠️ Restoran je suspendovan</h3>
            <div className="suspension-alert__item">
              <p className="suspension-alert__item__label">
                Razlog suspenzije:
              </p>
              <p className="suspension-alert__item__reason">
                {suspension.suspensionReason}
              </p>
              <p className="suspension-alert__item__date">
                Datum suspenzije:{" "}
                {new Date(suspension.suspendedAt).toLocaleDateString("sr-RS")}
              </p>
              {suspension.status === "APPEALED" && (
                <p className="suspension-alert__item__status">
                  Status: Žalba podneta
                </p>
              )}
              {suspension.status === "REJECTED" && (
                <p
                  className="suspension-alert__item__status"
                  style={{ color: "#dc2626", fontWeight: "600" }}
                >
                  Status: Žalba odbijena
                </p>
              )}
              {suspension.appealText && (
                <div className="suspension-alert__item__appeal">
                  <p className="suspension-alert__item__label">
                    Žalba na suspenziju:
                  </p>
                  <p className="suspension-alert__item__appeal-text">
                    {suspension.appealText}
                  </p>
                  {suspension.appealDate && (
                    <p className="suspension-alert__item__date">
                      Žalba podneta:{" "}
                      {new Date(suspension.appealDate).toLocaleDateString(
                        "sr-RS"
                      )}
                    </p>
                  )}
                  {suspension.status === "REJECTED" &&
                    suspension.decisionDate && (
                      <p
                        className="suspension-alert__item__date"
                        style={{ color: "#dc2626" }}
                      >
                        Žalba odbijena:{" "}
                        {new Date(suspension.decisionDate).toLocaleDateString(
                          "sr-RS"
                        )}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        )}

        {owners.length === 0 ? (
          <p>
            Trenutno nema evidentiranih vlasnika restorana kojima bi se dodelio
            restoran.
          </p>
        ) : (
          <form className="restaurant-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Naziv</label>
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
                    {owner.userName}
                  </option>
                ))}
              </select>
              {errors.ownerId && (
                <span className="error-msg">{errors.ownerId.message}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => navigate("/admin-restaurants")}
              >
                Otkaži
              </button>

              <button
                className="btn btn--primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Čuvanje..." : id ? "💾 Sačuvaj izmene" : "Dodaj"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantForm;

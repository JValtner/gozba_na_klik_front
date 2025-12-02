import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getMyRestaurants, deleteRestaurant, getRestaurantSuspension } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";
import AppealSuspensionModal from "./suspensions/AppealSuspensionModal";
import { showToast, showConfirm } from "../utils/toast";


const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suspensions, setSuspensions] = useState({});
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [selectedRestaurantForAppeal, setSelectedRestaurantForAppeal] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data);

        const suspensionsMap = {};
        for (const restaurant of data) {
          try {
            const suspension = await getRestaurantSuspension(restaurant.id);
            if (suspension) {
              suspensionsMap[restaurant.id] = suspension;
            }
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error(`Greška pri učitavanju suspenzije za restoran ${restaurant.id}:`, err);
            }
          }
        }
        setSuspensions(suspensionsMap);
      } catch (err) {
        setError("Greška pri učitavanju.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEdit = (restaurantId) => {
    navigate(`/restaurants/edit/${restaurantId}`);
  };

  const handleDelete = async (restaurantId, restaurantName) => {
    showConfirm(
      `Da li ste sigurni da želite da obrišete restoran "${restaurantName}"?`,
      async () => {
        try {
          await deleteRestaurant(restaurantId);
          showToast.success("Restoran je uspešno obrisan!");
          const data = await getMyRestaurants();
          setRestaurants(data);
        } catch (err) {
          console.error("Greška pri brisanju restorana:", err);
          showToast.error("Greška pri brisanju restorana. Pokušajte ponovo.");
        }
      }
    );
  };

  const handleMenu = (restaurant) => {
    navigate(`/restaurants/${restaurant.id}/menu`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS");
  };

  const handleAppealSuccess = async () => {
    const suspensionsMap = {};
    for (const restaurant of restaurants) {
      try {
        const suspension = await getRestaurantSuspension(restaurant.id);
        if (suspension) {
          suspensionsMap[restaurant.id] = suspension;
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(`Greška pri učitavanju suspenzije za restoran ${restaurant.id}:`, err);
        }
      }
    }
    setSuspensions(suspensionsMap);
  };

  const handleOpenAppealModal = (restaurantId, restaurantName) => {
    setSelectedRestaurantForAppeal({ id: restaurantId, name: restaurantName });
    setShowAppealModal(true);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__header">
          <div>
            <h1>Moji restorani</h1>
            <p>Upravljajte vašim restoranima</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        {Object.keys(suspensions).length > 0 && (
          <div className="suspension-alert">
            <h3>⚠️ Vaš restoran je suspendovan</h3>
            {Object.entries(suspensions).map(([restaurantId, suspension]) => {
              const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
              return (
                <div key={restaurantId} className="suspension-alert__item">
                  {restaurant && (
                    <p className="suspension-alert__item__restaurant-name">
                      {restaurant.name}
                    </p>
                  )}
                  <p className="suspension-alert__item__label">Razlog suspenzije:</p>
                  <p className="suspension-alert__item__reason">{suspension.suspensionReason}</p>
                  <p className="suspension-alert__item__date">
                    Datum suspenzije: {new Date(suspension.suspendedAt).toLocaleDateString("sr-RS")}
                  </p>
                  {suspension.status === "APPEALED" && (
                    <p className="suspension-alert__item__status">
                      Status: Žalba podneta
                    </p>
                  )}
                  {suspension.status === "REJECTED" && (
                    <p className="suspension-alert__item__status" style={{ color: "#dc2626", fontWeight: "600" }}>
                      Status: Žalba odbijena
                    </p>
                  )}
                  {suspension.appealText && (
                    <div className="suspension-alert__item__appeal">
                      <p className="suspension-alert__item__label">Žalba na suspenziju:</p>
                      <p className="suspension-alert__item__appeal-text">{suspension.appealText}</p>
                      {suspension.appealDate && (
                        <p className="suspension-alert__item__date">
                          Žalba podneta: {new Date(suspension.appealDate).toLocaleDateString("sr-RS")}
                        </p>
                      )}
                      {suspension.status === "REJECTED" && suspension.decisionDate && (
                        <p className="suspension-alert__item__date" style={{ color: "#dc2626" }}>
                          Žalba odbijena: {new Date(suspension.decisionDate).toLocaleDateString("sr-RS")}
                        </p>
                      )}
                    </div>
                  )}
                  {suspension.status === "SUSPENDED" && (
                    <button
                      className="btn btn--primary"
                      style={{ marginTop: "1rem" }}
                      onClick={() => handleOpenAppealModal(parseInt(restaurantId), restaurant?.name || "")}
                    >
                      Uloži žalbu na suspenziju
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showAppealModal && selectedRestaurantForAppeal && (
          <AppealSuspensionModal
            restaurantId={selectedRestaurantForAppeal.id}
            restaurantName={selectedRestaurantForAppeal.name}
            onClose={() => {
              setShowAppealModal(false);
              setSelectedRestaurantForAppeal(null);
            }}
            onSuccess={handleAppealSuccess}
          />
        )}

        {restaurants.length === 0 ? (
          <div className="dashboard__empty">
            <h2>Nemate nijedan restoran</h2>
            <p>Kontaktirajte administratora da vam dodeli restoran</p>
          </div>
        ) : (
          <div className="dashboard__grid">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="dashboard__card">
                {restaurant.photoUrl && (
                  <img
                    src={`${baseUrl}${restaurant.photoUrl}`}
                    alt={restaurant.name}
                    className="restaurant-image"
                  />
                )}
                <h2>{restaurant.name}</h2>
                {suspensions[restaurant.id] && (
                  <div className="suspension-badge">
                    ⚠️ Suspendovan
                  </div>
                )}
                <p>Kreiran: {formatDate(restaurant.createdAt)}</p>

                <div className="card-actions">
                  <button
                    className="btn btn--primary"
                    onClick={() => handleEdit(restaurant.id)}
                  >
                    Uredi
                  </button>

                  <button
                    className="btn btn--danger"
                    onClick={() => handleDelete(restaurant.id, restaurant.name)}
                  >
                    Obriši
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/restaurants/${restaurant.id}/employees`)}
                  >
                    Zaposleni
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => handleMenu(restaurant)}
                    title="Jelovnik"
                  >
                    Menu
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/restaurants/${restaurant.id}/orders`)}
                  >
                    Porudžbine
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIrresponsibleRestaurants } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import SuspendRestaurantModal from "./suspensions/SuspendRestaurantModal";
import "../../styles/_restaurants.scss";

const IrresponsibleRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIrresponsibleRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError("Greška pri učitavanju nesavesnih restorana. Pokušajte kasnije.");
      console.error("Error loading irresponsible restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleSuspend = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowSuspendModal(true);
  };

  const handleSuspendSuccess = (restaurantId) => {
    setRestaurants((prev) => 
      prev.map((r) => 
        r.id === restaurantId 
          ? { ...r, isSuspended: true, suspensionStatus: "SUSPENDED" }
          : r
      )
    );
    setShowSuspendModal(false);
    setSelectedRestaurant(null);
  };

  const handleCloseModal = () => {
    setShowSuspendModal(false);
    setSelectedRestaurant(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      <div className="table-container">
        <div className="title-container">
          <div>
            <h1>Nesavesni restorani</h1>
            <p>Restorani sa 5 ili više otkazanih porudžbina u poslednjih 7 dana</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn--primary"
              onClick={() => navigate("/admin-restaurants/suspension-appeals")}
            >
              Žalbe na suspenzije
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => navigate("/admin-restaurants")}
            >
              Nazad na restorane
            </button>
          </div>
        </div>
        {!restaurants || restaurants.length === 0 ? (
          <div className="dashboard__empty">
            <h2>Nema nesavesnih restorana</h2>
            <p>Svi restorani su ispunili kriterijume.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Adresa</th>
                <th>Telefon</th>
                <th>Vlasnik</th>
                <th>Broj otkazanih porudžbina</th>
                <th>Status</th>
                <th>Opcije</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => {
                const isSuspended = restaurant.isSuspended === true;
                return (
                  <tr key={restaurant.id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.address || "N/A"}</td>
                    <td>{restaurant.phone || "N/A"}</td>
                    <td>{restaurant.ownerUsername || "N/A"}</td>
                    <td>
                      <span className="badge badge--danger">
                        {restaurant.cancelledOrdersCount}
                      </span>
                    </td>
                    <td>
                      {isSuspended ? (
                        <span className="badge badge--warning">
                          {restaurant.suspensionStatus === "SUSPENDED"
                            ? "Suspendovan" 
                            : restaurant.suspensionStatus === "APPEALED"
                            ? "Žalba podneta"
                            : restaurant.suspensionStatus === "REJECTED"
                            ? "Žalba odbijena"
                            : "Suspendovan"}
                        </span>
                      ) : (
                        <span className="badge badge--success">Aktivan</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn--danger btn--small"
                        onClick={() => handleSuspend(restaurant)}
                        disabled={isSuspended}
                        title={isSuspended ? "Restoran je već suspendovan" : ""}
                      >
                        {isSuspended ? "Već suspendovan" : "Suspenduj"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showSuspendModal && selectedRestaurant && (
        <SuspendRestaurantModal
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
          onSuccess={handleSuspendSuccess}
        />
      )}
    </div>
  );
};

export default IrresponsibleRestaurantsPage;


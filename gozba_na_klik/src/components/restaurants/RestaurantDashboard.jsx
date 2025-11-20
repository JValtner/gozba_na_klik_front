import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getMyRestaurants, deleteRestaurant } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";


const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data);
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
    if (!window.confirm(`Da li ste sigurni da želite da obrišete restoran "${restaurantName}"?`)) {
      return;
    }

    try {
      await deleteRestaurant(restaurantId);
      alert("Restoran je uspešno obrisan!");
      const data = await getMyRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Greška pri brisanju restorana:", err);
      alert("Greška pri brisanju restorana. Pokušajte ponovo.");
    }
  };

  const handleMenu = (restaurant) => {
    navigate(`/restaurants/${restaurant.id}/menu`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS");
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
                  <button
                    className="btn btn--primary"
                    onClick={() => navigate("/restaurants/complaints")}
                  >
                    Žalbe
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
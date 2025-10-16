import React, { useEffect } from "react";
import { useState } from "react";
import RestaurantTableRow from "./RestaurantTableRow";
import Spinner from "../spinner/Spinner";
import {
  deleteRestaurant,
  getAllRestaurants,
} from "../service/restaurantsService";
import { useNavigate } from "react-router-dom";

const RestaurantTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRestaurants = async () => {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError("Lista trenutno nije dostupna. Pokusajte kasnije.");
    }
    setLoading(false);
  };

  const handleDelete = async (restaurantId) => {
    setLoading(true);
    try {
      await deleteRestaurant(restaurantId);
      setRestaurants((restaurants) =>
        restaurants.filter((restaurant) => restaurant.id !== restaurantId)
      );
    } catch (err) {
      setError("Brisanje restorana nije uspelo, pokusajte ponovo.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="title-container">
        <h1>Restaurants</h1>
        <button
          className="btn btn--secondary"
          onClick={() => navigate("/admin-restaurant-form")}
        >
          + Dodaj restoran
        </button>
      </div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <RestaurantTableRow
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                address={restaurant.address}
                phone={restaurant.phone}
                owner={restaurant.owner?.username}
                onDelete={() => handleDelete(restaurant.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantTable;

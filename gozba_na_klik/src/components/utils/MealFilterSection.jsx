import React from "react";

const MealFilterSection = ({ filter, setFilter }) => {
  const handleChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value || null
    }));
  };

  return (
    <div className="restaurant-filter-section">
      <div className="filter-control">
        <span className="filter-icon">🍽️</span>
        <input
          type="text"
          placeholder="Naziv jela"
          value={filter.Name || ""}
          onChange={(e) => handleChange("Name", e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-control">
        <span className="filter-icon">🏨</span>
        <input
          type="text"
          placeholder="Restoran"
          value={filter.RestaurantName || ""}
          onChange={(e) => handleChange("RestaurantName", e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-control">
        <span className="filter-icon">💰</span>
        <input
          type="number"
          min="0"
          placeholder="Cena od"
          value={filter.MinPrice ?? ""}
          onChange={(e) =>
            handleChange("MinPrice", e.target.value ? Number(e.target.value) : null)
          }
          className="filter-input"
        />
      </div>

      <div className="filter-control">
        <span className="filter-icon">💵</span>
        <input
          type="number"
          min="0"
          placeholder="Cena do"
          value={filter.MaxPrice ?? ""}
          onChange={(e) =>
            handleChange("MaxPrice", e.target.value ? Number(e.target.value) : null)
          }
          className="filter-input"
        />
      </div>
    </div>
  );
};

export default MealFilterSection;

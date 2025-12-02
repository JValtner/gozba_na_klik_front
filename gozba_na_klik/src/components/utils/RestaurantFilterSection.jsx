import React from "react";

const RestaurantFilterSection = ({ filter, setFilter }) => {
  const handleChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value || null
    }));
  };

  return (
    <div className="restaurant-filter-section">
      <div className="filter-control">
        <span className="filter-icon">🔍</span>
        <input
          type="text"
          placeholder="Naziv restorana"
          value={filter.Name || ""}
          onChange={(e) => handleChange("Name", e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-control">
        <span className="filter-icon">📍</span>
        <input
          type="text"
          placeholder="Adresa"
          value={filter.Address || ""}
          onChange={(e) => handleChange("Address", e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  );
};

export default RestaurantFilterSection;

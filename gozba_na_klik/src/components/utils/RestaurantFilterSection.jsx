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
      <div className="filter-row">
        <label>
          Naziv restorana:
          <input
            type="text"
            value={filter.Name || ""}
            onChange={(e) => handleChange("Name", e.target.value)}
          />
        </label>

        <label>
          Adresa:
          <input
            type="text"
            value={filter.Address || ""}
            onChange={(e) => handleChange("Address", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default RestaurantFilterSection;

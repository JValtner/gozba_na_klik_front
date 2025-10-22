import React from "react";

const MealFilterSection = ({ filter, setFilter }) => {
  const handleChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value || null
    }));
  };

  return (
    <div className="meal-filter-section">
      <div className="filter-row">
        <label>
          Naziv jela:
          <input
            type="text"
            value={filter.Name || ""}
            onChange={(e) => handleChange("Name", e.target.value)}
          />
        </label>

        <label>
          Restoran:
          <input
            type="text"
            value={filter.RestaurantName || ""}
            onChange={(e) => handleChange("RestaurantName", e.target.value)}
          />
        </label>

        <label>
          Cena od:
          <input
            type="number"
            min="0"
            value={filter.MinPrice ?? ""}
            onChange={(e) =>
              handleChange("MinPrice", e.target.value ? Number(e.target.value) : 0)
            }
          />
        </label>

        <label>
          Cena do:
          <input
            type="number"
            min="0"
            value={filter.MaxPrice ?? ""}
            onChange={(e) =>
              handleChange("MaxPrice", e.target.value ? Number(e.target.value) : 0)
            }
          />
        </label>
      </div>
    </div>
  );
};

export default MealFilterSection;

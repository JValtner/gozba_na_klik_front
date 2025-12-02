import React from "react";

const SortForm = ({ sortTypes, chosenType, onSortChange }) => {
  return (
    <div className="sort-form-wrapper">
      <span className="sort-icon">⇅</span>
      <select
        className="sort-select"
        value={chosenType}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="">Sortiraj</option>
        {sortTypes.map((stype) => (
          <option key={stype.key ?? stype.id} value={stype.key ?? stype.id}>
            {stype.name ?? stype.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortForm;

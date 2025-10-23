import React from "react";

const SortForm = ({ sortTypes, chosenType, onSortChange }) => {
  return (
    <div className="sort-form-wrapper">
      <label className="sort-label">
        <span className="arrow">⇅</span>
        <select
          className="sort-select"
          value={chosenType}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">⇅</option>
          {sortTypes.map((stype) => (
            <option key={stype.key ?? stype.id} value={stype.key ?? stype.id}>
              {stype.name ?? stype.Name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SortForm;

import React from "react";

const RestaurantTableRow = ({ name, address, phone, owner, onDelete }) => {
  return (
    <tr className="table-row">
      <td>{name}</td>
      <td>{address}</td>
      <td>{phone}</td>
      <td>{owner}</td>
      <td>
        <div className="btn-container">
          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RestaurantTableRow;

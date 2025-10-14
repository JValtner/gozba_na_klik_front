import React from "react";
import { Link } from "react-router-dom";

const RestaurantTableRow = ({ id, name, address, phone, owner, onDelete }) => {
  return (
    <tr className="table-row">
      <td>{name}</td>
      <td>{address}</td>
      <td>{phone}</td>
      <td>{owner}</td>
      <td>
        <div className="btn-container">
          <button className="delete-btn" onClick={onDelete}>
            Obriši
          </button>
          <Link
            to={`/admin-restaurant-form/${id}`}
            className="btn btn--secondary"
          >
            Izmeni
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default RestaurantTableRow;

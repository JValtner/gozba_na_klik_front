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
          <Link
            to={`/admin-restaurant-form/${id}`}
            className="btn btn--secondary"
          >
            Uredi
          </Link>
          <button className="delete-btn" onClick={onDelete}>
            Obriši
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RestaurantTableRow;

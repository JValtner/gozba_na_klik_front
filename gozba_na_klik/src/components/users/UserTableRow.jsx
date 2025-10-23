import React from "react";

const UserTableRow = ({ id, username, email, role, onRoleChange }) => {
  return (
    <tr className="table-row">
      <td>{username}</td>
      <td>{email}</td>
      <td>
        <select
          value={role}
          onChange={(e) => onRoleChange(id, e.target.value)}
          disabled={role === "Admin"}
          style={{ cursor: role === "Admin" ? "not-allowed" : "pointer" }}
        >
          <option value="User">Kupac</option>
          <option value="DeliveryPerson">Dostavljac</option>
          <option value="RestaurantOwner">Vlasnik</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
    </tr>
  );
};

export default UserTableRow;

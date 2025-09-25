import React from "react";

const UserTableRow = ({
  id,
  username,
  email,
  role,
  onRoleChange,
  onDelete,
}) => {
  return (
    <tr className="table-row">
      <td>{id}</td>
      <td>{username}</td>
      <td>{email}</td>
      <td>
        <select value={role} onChange={(e) => onRoleChange(id, e.target.value)}>
          <option value="User">User</option>
          <option value="Kurir">Kurir</option>
          <option value="Vlasnik">Vlasnik</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
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

export default UserTableRow;

import React, { useEffect } from "react";
import { useState } from "react";
import UserTableRow from "./UserTableRow";
import Spinner from "../spinner/Spinner";
import { deleteUser, getAllUsers, updateUser } from "../service/userService";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Lista trenutno nije dostupna. Pokusajte kasnije.");
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) return;

    const updatedUser = { ...currentUser, role: newRole };
    try {
      await updateUser(userId, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      );
      console.log(`Uloga korisnika ${userId} promenjena u ${newRole}`);
    } catch (error) {
      console.error("Greska pri promeni uloge:", error);
      setError("Promena uloge nije uspela. Molimo pokusajte ponovo.");
    }
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      setUsers((users) => users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Brisanje korisnika nije uspelo, pokusajte ponovo.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="title-container">
        <h1>Users</h1>
      </div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                id={user.id}
                username={user.username}
                email={user.email}
                role={user.role}
                onRoleChange={handleRoleChange}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;

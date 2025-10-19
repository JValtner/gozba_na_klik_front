import React, { useEffect } from "react";
import { useState } from "react";
import UserTableRow from "./UserTableRow";
import Spinner from "../spinner/Spinner";
import { getAllUsers, updateUserRoleByAdmin } from "../service/userService";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // uklanja error posle 5 sekundi
      }, 5000);

      // Čišćenje timeout-a ako se error promeni ili komponenta unmount-uje
      return () => clearTimeout(timer);
    }
  }, [error]);

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

    if (currentUser.role === "Admin") {
      setError("Uloga admina se ne može menjati.");
      return;
    }

    if (newRole === "Admin") {
      setError("Ne možete dodeliti ulogu admina.");
      return;
    }

    const updatedUser = { ...currentUser, role: newRole };

    try {
      await updateUserRoleByAdmin(userId, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      );
      console.log(`Uloga korisnika ${userId} promenjena u ${newRole}`);
    } catch (error) {
      console.error("Greska pri promeni uloge:", error);
      setError("Promena uloge nije uspela. Molimo pokusajte ponovo.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="error-container">
        {error && <span className="error-span show">{error}</span>}
      </div>
      <div className="table-container">
        <div className="title-container">
          <div>
            <h1>Korisnici</h1>
            <p>Pregledajte i upravljajte korisnicima</p>
          </div>
        </div>
        {!users.length > 0 ? (
          <p>Trenutno nema evidentiranih korisnika</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Uloga</th>
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
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersTable;

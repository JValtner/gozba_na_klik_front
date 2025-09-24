import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { Link, Navigate } from "react-router-dom";


export default function Header() {
  const { username, isAuth, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="logo">🍴 Gozba na klik</div>
      <div className="user-info">
        {isAuth ? (
          <>
            <span>Dobrodošli, <strong>{username}</strong></span>
            <button className="logout-btn" onClick={handleLogout}>Odjava</button>
          </>
        ) : (
          <span>Niste ulogovani</span>
        )}
      </div>
    </header>
  );
}

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../users/UserContext";

export default function Header() {
  const { username, userId, isAuth, logout } = useUser();
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
              <button className="profile-btn">
                <Link to={`/profile/${userId}`}>Profil</Link>
              </button>
            
            <button className="logout-btn" onClick={handleLogout}>Odjava</button>
          </>
        ) : (
          <span>Niste ulogovani</span>
        )}
      </div>
    </header>
  );
}
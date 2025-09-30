import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getUserById } from "../service/userService"; 


export default function Header() {
  const { username, userId, isAuth, logout } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const existingUser = await getUserById(Number(userId))
          if (existingUser) {
            setUser(existingUser)
          }
        } catch (err) {
          console.error("Failed to fetch user", err)
        }
      }
    }
    fetchUser()
  }, [userId])
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
                <Link to={`/profile/${userId}`} className="profile-btn">
                <img
                  alt="Profile"
                  className="profile-icon"
                  src={
                    user?.userImage
                      ? `http://localhost:5065${user.userImage}`
                      : "/default-profile.png"
                  }
                />
              Profil
            </Link>
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
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getUserById } from "../service/userService";
import { baseUrl } from "../../config/routeConfig";

export default function Header() {
  const { username, userId, isAuth, logout, role } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const existingUser = await getUserById(Number(userId));
          if (existingUser) {
            setUser(existingUser);
          }
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const profileImageSrc = user?.userImage
    ? `${baseUrl}${user.userImage}`
    : `${baseUrl}/assets/profileImg/default_profile.png`;

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        🍴 Gozba na klik
      </div>
        {isAuth && role === "Admin" && (
          <div className="navbar-links">
            <ul>
              <li>
                <Link to={"admin-users"}>Korisnici</Link>
              </li>
              <li>
                <Link to={"admin-restaurants"}>Restorani</Link>
              </li>
            </ul>
          </div>
        )}
      <div className="user-info">
        {isAuth && (
          <>
            <span>Dobrodošli, <strong>{username}</strong></span>
            
            {user?.role === "RestaurantOwner" && (
              <button className="dashboard-btn" onClick={() => navigate("/restaurants/dashboard")}>
                🏠 Moji restorani
              </button>
            )}
            
            <button className="profile-btn">
              <Link to={`/profile/${userId}`} className="profile-btn">
                <img
                  alt="Profile"
                  className="profile-icon"
                  src={profileImageSrc}
                />
                Profil
              </Link>
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Odjava
            </button>
          </>
        )}
      </div>
    </header>
  );
}

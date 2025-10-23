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
          if (existingUser) setUser(existingUser);
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
      <div className="logo-and-links">
        <div className="logo" onClick={() => navigate("/")}>
          🍴 Gozba na klik
        </div>

        {isAuth && (
          <nav className="navbar-links">
            <ul>
              <li>
                <Link to={"/search"}>Pretraga jela</Link>
              </li>
              {role === "Admin" && (
                <>
                  <li>
                    <Link to={"/admin-users"}>Korisnici</Link>
                  </li>
                  <li>
                    <Link to={"/admin-restaurants"}>Restorani</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>

      <div className="user-info">
        {!isAuth ? (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Prijava
          </button>
        ) : (
          <>
            <span>
              Dobrodošli, <strong>{username}</strong>
            </span>

            {user?.role === "RestaurantOwner" && (
              <button
                className="dashboard-btn"
                onClick={() => navigate("/restaurants/dashboard")}
              >
                🏠 Moji restorani
              </button>
            )}

            <Link to={`/profile/${userId}`} className="profile-btn">
             <button className="profile-btn" name="Profile"><img
                alt="Profile"
                className="profile-icon"
                src={profileImageSrc}
              />Profile
              </button>
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              Odjava
            </button>
          </>
        )}
      </div>
    </header>
  );
}

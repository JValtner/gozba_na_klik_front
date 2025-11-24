import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getCurrentProfile } from "../service/userService";
import { baseUrl } from "../../config/routeConfig";

export default function Header() {
  const { username, userId, isAuth, logout, role } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    `${baseUrl}/assets/profileImg/default_profile.png`
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuth) {
        try {
          const userProfile = await getCurrentProfile();
          if (userProfile?.userImage) {
            setProfileImage(`${baseUrl}${userProfile.userImage}`);
          }
        } catch (err) {
          console.error("Failed to fetch user profile image", err);
        }
      }
    };

    fetchProfile();
  }, [isAuth]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="logo-and-links">
        <div className="logo" onClick={() => navigate("/")}>
          🍴 Gozba na klik
        </div>

        {isAuth && (
          <nav className="navbar-links">
            <ul>
              {(role === "User" || role === "Buyer") && (
                <>
                  <li>
                    <Link to={"/search"}>Pretraga jela</Link>
                  </li>
                  <li>
                    <Link to={"/my-orders"} className="my-orders-link">
                      📋 Moje porudžbine
                    </Link>
                  </li>
                </>
              )}

              {role === "Admin" && (
                <>
                  <li>
                    <Link to={"/admin-users"}>Korisnici</Link>
                  </li>
                  <li>
                    <Link to={"/admin-restaurants"}>Restorani</Link>
                  </li>
                  <li>
                    <Link to={"/reporting/dashboard"}>Izveštaji</Link>
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

            {role === "RestaurantOwner" && (
              <button
                className="dashboard-btn"
                onClick={() => navigate("/restaurants/dashboard")}
              >
                🏠 Moji restorani
              </button>
            )}

            <Link to={`/profile`} className="profile-btn">
              <button className="profile-btn" name="Profile">
                <img alt="Profile" className="profile-icon" src={profileImage} /> 
                Profile
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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosConfig from "../../config/axios.config";
import { useUser } from "../users/UserContext";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUsername, setUserId, setRole, isAuth, role, userId } = useUser();

  useEffect(() => {
    if (isAuth && role && userId) {
      redirectToDashboard(role, userId);
    }
  }, [isAuth, role, userId]);

  const redirectToDashboard = (userRole, id) => {
    if (userRole === "Admin") {
      navigate("/admin-users", { replace: true });
    } else if (userRole === "RestaurantOwner") {
      navigate("/restaurants/dashboard", { replace: true });
    } else if (userRole === "RestaurantEmployee") {
      navigate("/employee/dashboard", { replace: true });
    } else if (userRole === "DeliveryPerson") {
      navigate("/delivery/dashboard", { replace: true });
    } else {
      navigate(`/profile/${id}`, { replace: true });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Molimo unesite korisničko ime i lozinku");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await AxiosConfig.post("/api/users/login", {
        username: formData.username,
        password: formData.password,
      });

      const { id, username, role, token } = response.data;

      if (!id || !username) {
        throw new Error("Server nije vratio potrebne podatke (id ili username)");
      }

      setUsername(username);
      setUserId(Number(id));
      setRole(role);

      localStorage.setItem("username", username);
      localStorage.setItem("userId", String(id));
      localStorage.setItem("role", role);
      if (token) {
        localStorage.setItem("token", token);
      }

      alert(`Uspešna prijava! Dobrodošli ${username}`);
      redirectToDashboard(role, id);

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Greška prilikom prijave";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  if (isAuth) {
    return (
      <div className="welcome-page">
        <div className="welcome-page__content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.5rem',
            color: '#4b5563'
          }}>
            Redirektovanje...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <div className="welcome-page__content">
        <div className="welcome-page__left">
          <div className="welcome-content">
            <h1 className="welcome-content__title">Gozba na klik</h1>
            <p className="welcome-content__subtitle">
              Dobrodošli u najbolju aplikaciju za naručivanje hrane!
            </p>
            <p className="welcome-content__description">
              Otkrijte ukusna jela iz vaših omiljenih restorana i naručite ih
              brzo i lako.
            </p>
            <div className="welcome-content__feature">
              <div className="feature-dot"></div>
              <p className="feature-text">Brza dostava</p>
            </div>
          </div>
        </div>

        <div className="welcome-page__right">
          <div className="login-form-container">
            <div className="login-form__header">
              <h2 className="login-form__title">Prijava</h2>
              <p className="login-form__subtitle">Prijavite se na vaš nalog</p>
            </div>

            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Korisničko ime
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Unesite korisničko ime"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Lozinka
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Unesite lozinku"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="error-message">
                  <p className="error-message__text">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn--primary btn--full-width"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner loading-spinner--small"></span>
                    Prijavljivanje...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </button>
            </form>

            <div className="login-form__footer">
              <p className="footer-text">Nemate nalog?</p>
              <button
                type="button"
                onClick={handleGoToRegister}
                className="btn btn--secondary btn--full-width"
              >
                Registruj se
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
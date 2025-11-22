import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config/routeConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import Spinner from "../spinner/Spinner";
import { requestPasswordReset } from "../service/userService";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { role, isAuth, login } = useUser();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuth && role) {
      switch (role) {
        case "Admin":
          navigate("/admin-users");
          break;
        case "RestaurantOwner":
          navigate("/restaurants/dashboard");
          break;
        case "RestaurantEmployee":
          navigate("/employee/dashboard");
          break;
        case "DeliveryPerson":
          navigate("/delivery/dashboard");
          break;
        case "Buyer":
        default:
          navigate("/restaurants/home");
          break;
      }
    }
  }, [isAuth, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMsg("");
  };

  // LOGIN SUBMIT
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (forgotMode) return; // ignore login submit in forgot mode

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Molimo unesite korisničko ime i lozinku");
      return;
    }

    setIsLoading(true);
    try {
      const token = await login({
        username: formData.username,
        password: formData.password,
      });

      if (!token) {
        setError("Neuspešna prijava. Proverite korisničko ime i lozinku.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Greška prilikom prijave";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // FORGOT PASSWORD SUBMIT
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("Molimo unesite email adresu.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMsg("");

    try {
      await requestPasswordReset(formData.email);
      setMsg("Link za reset lozinke je uspesno poslat");
    } catch (err) {
      const msg = err.response?.data?.message || "Greška prilikom slanja emaila.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => navigate("/register");

  return (
    <div className="welcome-page">
      <div className="welcome-page__content">
        {isAuth ? (
          <Spinner />
        ) : (
          <>
            <div className="welcome-page__left">
              <div className="welcome-content">
                <h1 className="welcome-content__title">Gozba na klik</h1>
                <p className="welcome-content__subtitle">
                  Dobrodošli u najbolju aplikaciju za naručivanje hrane!
                </p>
              </div>
            </div>

            <div className="welcome-page__right">
              <div className="login-form-container">
                <div className="login-form__header">
                  <h2 className="login-form__title">
                    {forgotMode ? "Reset lozinke" : "Prijava"}
                  </h2>
                </div>

                <form
                  className="login-form"
                  onSubmit={forgotMode ? handleForgotPasswordSubmit : handleLoginSubmit}
                >
                  {!forgotMode && (
                    <>
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
                          disabled={isLoading}
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
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}

                  {forgotMode && (
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Unesite email za reset lozinke
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {error && (
                    <div className="error-message">
                      <p className="error-message__text">{error}</p>
                    </div>
                  )}

                  {msg && (
                    <div className="success-message">
                      <p className="success-message__text">{msg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn--primary btn--full-width"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Molimo sačekajte..."
                      : forgotMode
                      ? "Pošalji link"
                      : "Prijavi se"}
                  </button>
                </form>
                  
                <div className="forgot-password">
                  <button
                    type="button"
                    className="btn btn--secondary btn--full-width"
                    onClick={() => {
                      setForgotMode(!forgotMode);
                      setError("");
                      setMsg("");
                    }}
                  >
                    {forgotMode ? "← Nazad na prijavu" : "Zaboravljena lozinka?"}
                  </button>
                </div>

                {!forgotMode && (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
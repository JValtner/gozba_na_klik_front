import React, { useState } from 'react';
import { authenticationService } from '../services/authenticationService';
import Footer from './Footer';

const WelcomePage = ({ onLogin, onGoToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Molimo unesite korisničko ime i lozinku');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authenticationService.login(
        formData.username,
        formData.password
      );

      if (result.success) {
        onLogin(result.data);
      } else {
        setError(result.message);
      }
    } catch (unexpectedError) {
      console.error('Unexpected error during login:', unexpectedError);
      setError('Došlo je do neočekivane greške');
    } finally {
      setIsLoading(false);
    }
  };

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
              Otkrijte ukusna jela iz vaših omiljenih restorana i naručite ih brzo i lako.
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
                <label htmlFor="username" className="form-label">Korisničko ime</label>
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
                <label htmlFor="password" className="form-label">Lozinka</label>
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
                  'Prijavi se'
                )}
              </button>
            </form>

            <div className="login-form__footer">
              <p className="footer-text">Nemate nalog?</p>
              <button
                type="button"
                onClick={onGoToRegister}
                className="btn btn--secondary btn--full-width"
              >
                Registruj se
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WelcomePage;

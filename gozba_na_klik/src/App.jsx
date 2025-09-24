import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import Header from "./components/welcome/Header";
import Footer from "./components/welcome/Footer";
import "./styles/main.scss";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    console.log("User logged in:", userData);
    setCurrentUser(userData);
  };

  const handleGoToRegister = () => {
    alert("U pripremi je registracija korisnika.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Header />
      <main>
        {!currentUser ? (
          <Routes>
            <Route
              path="/"
              element={
                <WelcomePage
                  onLogin={handleLogin}
                  onGoToRegister={handleGoToRegister}
                />
              }
            />
            <Route path="/register" element={<RegisterUserForm />} />
          </Routes>
        ) : (
          <div className="dashboard">
            <div className="dashboard__container">
              <div className="dashboard__header">
                <div>
                  <h1>Dashboard za {currentUser.username}</h1>
                  <p>Uloga: {currentUser.role}</p>
                </div>
                <button className="btn btn--danger" onClick={handleLogout}>
                  Odjavi se
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </Router>
  );
};

export default App;

import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setCurrentUser(userData);
  };

  const handleGoToRegister = () => {
    alert('U pripremi je registracija korisnika.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <WelcomePage 
        onLogin={handleLogin}
        onGoToRegister={handleGoToRegister}
      />
    );
  }

  return (
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
  );
};

export default App;
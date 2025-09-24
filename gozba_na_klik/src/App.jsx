import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import Header from "./components/welcome/Header";
import Footer from "./components/welcome/Footer";
import "./styles/main.scss";

export default function App() {
  return (
    <Router>
      <Header />
      <WelcomePage onLogin={handleLogin} onGoToRegister={handleGoToRegister} />
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterUserForm />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

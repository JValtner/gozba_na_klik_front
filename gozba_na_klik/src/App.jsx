import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/welcome/Header";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import UserProfile from "./components/users/UserProfile";
import UsersTable from "./components/users/UsersTable";
import AdminRoute from "./components/users/AdminRoute";
import Footer from "./components/welcome/Footer";
import "./styles/main.scss";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterUserForm />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route
              path="/admin-users"
              element={
                <AdminRoute>
                  <UsersTable />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

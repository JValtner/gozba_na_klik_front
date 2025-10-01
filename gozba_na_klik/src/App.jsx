import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/welcome/Header";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import UserProfile from "./components/users/UserProfile";
import UsersTable from "./components/users/UsersTable";
import AdminRoute from "./components/users/AdminRoute";
import RestaurantDashboard from "./components/restaurants/RestaurantDashboard";
import EditRestaurant from "./components/restaurants/EditRestaurant";
import WorkingHours from "./components/restaurants/WorkingHours";
import ClosedDates from "./components/restaurants/ClosedDates";
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
            {/* Restaurant rute */}
            <Route path="/restaurants/dashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurants/edit/:id" element={<EditRestaurant />} />
            <Route path="/restaurants/:id/working-hours" element={<WorkingHours />} />
            <Route path="/restaurants/:id/closed-dates" element={<ClosedDates />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
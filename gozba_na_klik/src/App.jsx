import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/welcome/Header";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import UserProfile from "./components/users/UserProfile";
import UsersTable from "./components/users/UsersTable";
import AdminRoute from "./components/users/AdminRoute";
import RestaurantDashboard from "./components/restaurants/RestaurantDashboard";
import Menu from "./components/restaurants/menu/Menu";
import EditRestaurant from "./components/restaurants/EditRestaurant";
import WorkingHours from "./components/restaurants/WorkingHours";
import ClosedDates from "./components/restaurants/ClosedDates";
import Footer from "./components/welcome/Footer";
import "./styles/main.scss";
import EmployeesDashboard from "./components/employees/EmployeesDashboard";
import DeliveryDashboard from "./components/delivery/DeliveryDashboard";
import DeliverySchedule from "./components/delivery/DeliverySchedule";
import RestaurantTable from "./components/restaurants/RestaurantTable";
import AdminRestaurantForm from "./components/restaurants/AdminRestaurantForm";
import CreateMeal from "./components/restaurants/meal/CreateMeal";
import EditMeal from "./components/restaurants/meal/EditMeal";
import MealDetails from "./components/restaurants/meal/MealDetail";
import EditUserAlergens from "./components/users/EditUserAlergens";
import CourierOrderDashboard from "./components/delivery/CourierOrderDashboard";
import CourierOrderCard from "./components/delivery/CourierOrderCard";

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

            {/* Ruta za izmenu korisnikovih alergena */}
            <Route
              path="/profile/:id/alergens"
              element={<EditUserAlergens />}
            />
            {/* Admin rute */}
            <Route
              path="/admin-users"
              element={
                <AdminRoute>
                  <UsersTable />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-restaurants"
              element={
                <AdminRoute>
                  <RestaurantTable />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-restaurant-form"
              element={
                <AdminRoute>
                  <AdminRestaurantForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-restaurant-form/:id"
              element={
                <AdminRoute>
                  <AdminRestaurantForm />
                </AdminRoute>
              }
            />

            {/* Restaurant rute */}
            <Route
              path="/restaurants/dashboard"
              element={<RestaurantDashboard />}
            />
            <Route path="/restaurants/edit/:id" element={<EditRestaurant />} />
            <Route
              path="/restaurants/:id/working-hours"
              element={<WorkingHours />}
            />
            <Route
              path="/restaurants/:id/closed-dates"
              element={<ClosedDates />}
            />
            <Route
              path="/restaurants/:id/employees"
              element={<EmployeesDashboard />}
            />
            <Route
              path="/restaurants/:id/menu/:mealId/edit"
              element={<EditMeal />}
            />
            <Route
              path="/restaurants/:id/menu/:mealId"
              element={<MealDetails />}
            />
            <Route path="/restaurants/:id/menu" element={<Menu />} />
            <Route path="/restaurants/:id/menu/new" element={<CreateMeal />} />

            {/* Delivery rute */}
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/schedule" element={<DeliverySchedule />} />
            <Route
              path="/delivery/CourierOrderDashboard"
              element={<CourierOrderDashboard />}
            />
            <Route
              path="/delivery/CourierOrderCard"
              element={<CourierOrderCard />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/welcome/Header";
import WelcomePage from "./components/welcome/WelcomePage";
import RegisterUserForm from "./components/users/RegisterUserForm";
import UserProfile from "./components/users/UserProfile";
import UsersTable from "./components/users/UsersTable";
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
import OrderSummary from "./components/orders/OrderSummary";
import OrderDetails from "./components/orders/OrderDetails";
import RestaurantOrdersPage from "./components/orders/RestaurantOrdersPage";
import CustomerOrdersPage from "./components/orders/CustomerOrderPage";
import HomeRestaurants from "./components/restaurants/HomeRestaurants";
import GlobalMealSearch from "./components/restaurants/GeneralMealSearch";
import ResetPasswordPage from "./components/users/ResetPasswordPage";
import { LOGGED_IN_ROLES } from "./config/routes/roles";
import ProtectedRoute from "./config/routes/ProtectedRoute";
import OrderTrackingPage from "./components/orders/OrderTrackingPage";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            {/* SVI */}
            <Route path="/" element={<HomeRestaurants />} />
            <Route path="/search" element={<GlobalMealSearch />} />
            <Route path="/register" element={<RegisterUserForm />} />
            <Route path="/login" element={<WelcomePage />} />
            <Route path="/restaurants/home" element={<HomeRestaurants />} />
            <Route path="/restaurants/:id/menu" element={<Menu />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* SVI SEM GUEST */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.EveryRole}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* KUPAC - User */}
            <Route
              path="/profile/alergens"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.User}>
                  <EditUserAlergens />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute allowedRoles={["User", "Buyer"]}>
                  <CustomerOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-active-order"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.User}>
                  <OrderTrackingPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN - Admin */}
            <Route
              path="/admin-users"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.Admin}>
                  <UsersTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-restaurants"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.Admin}>
                  <RestaurantTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-restaurant-form"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.Admin}>
                  <AdminRestaurantForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-restaurant-form/:id"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.Admin}>
                  <AdminRestaurantForm />
                </ProtectedRoute>
              }
            />

            {/* VLASNIK - RestaurantOwner*/}
            <Route
              path="/restaurants/dashboard"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/edit/:id"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <EditRestaurant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/working-hours"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <WorkingHours />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/closed-dates"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <ClosedDates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/employees"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <EmployeesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/menu/new"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <CreateMeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/menu/:mealId/edit"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <EditMeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id/menu/:mealId"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <MealDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:restaurantId/orders"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.RestaurantOwner}>
                  <RestaurantOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:restaurantId/order-summary"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "Buyer",
                    LOGGED_IN_ROLES.User,
                    LOGGED_IN_ROLES.RestaurantOwner,
                  ]}
                >
                  <OrderSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "Buyer",
                    LOGGED_IN_ROLES.User,
                    LOGGED_IN_ROLES.RestaurantOwner,
                  ]}
                >
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            {/* DOSTAVLJAC - DeliveryPerson*/}
            <Route
              path="/delivery/CourierOrderDashboard"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.DeliveryPerson}>
                  <CourierOrderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/CourierOrderCard"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.DeliveryPerson}>
                  <CourierOrderCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/dashboard"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.DeliveryPerson}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/schedule"
              element={
                <ProtectedRoute allowedRoles={LOGGED_IN_ROLES.DeliveryPerson}>
                  <DeliverySchedule />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

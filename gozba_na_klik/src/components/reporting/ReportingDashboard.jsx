import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config/routeConfig";
import { getAllRestaurants, getRestaurantById } from "../service/restaurantsService";
import { getMealsByRestaurantId } from "../service/menuService";

import ReportingProfitSummary from "./ReportingProfitSummary";
import ReportingMealSalesSummary from "./ReportingMealSalesSummary";
import ReportingOrdersSummary from "./ReportingOrdersSummary";
import ReportingMonthlyReport from "./ReportingMonthlyReport";

const ReportingDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  // date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // meal selector
  const [meals, setMeals] = useState([]);
  const [mealId, setMealId] = useState("");

  // chart type selector
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    getAllRestaurants().then(setRestaurants);
  }, []);

  useEffect(() => {
    if (!restaurantId) return;
    getRestaurantById(restaurantId).then(setRestaurantInfo);
    getMealsByRestaurantId(restaurantId).then(setMeals);
  }, [restaurantId]);

  return (
    <div className="reporting-dashboard">
      <h1 className="title">Reporting Dashboard</h1>

      <div className="section">
        <h2>Restaurant</h2>

        <div className="row">
          <select
            value={restaurantId}
            onChange={e => setRestaurantId(e.target.value)}
          >
            <option value="">Select restaurant...</option>
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          {restaurantInfo && (
            <div className="restaurant-card">
              <img src={`${baseUrl}${restaurantInfo.photoUrl}`} alt={restaurantInfo?.name} />
              <div>
                <h3>{restaurantInfo.name}</h3>
                <p>{restaurantInfo.description}</p>
                <p><strong>Adresa:</strong> {restaurantInfo.address}</p>
                <p><strong>Telefon:</strong> {restaurantInfo.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReportingProfitSummary
        restaurantId={restaurantId}
        startDate={startDate}
        endDate={endDate}
        chartType={chartType}
      />

      <ReportingMealSalesSummary
        restaurantId={restaurantId}
        mealId={mealId}
        startDate={startDate}
        endDate={endDate}
        chartType={chartType}
      />

      <ReportingOrdersSummary
        restaurantId={restaurantId}
        startDate={startDate}
        endDate={endDate}
        chartType={chartType}
      />

      <ReportingMonthlyReport restaurantId={restaurantId} />
    </div>
  );
};

export default ReportingDashboard;

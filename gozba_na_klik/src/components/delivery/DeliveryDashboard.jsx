import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { username } = useUser();

  return (
    <div className="delivery-dashboard">
      <div className="delivery-dashboard__container">
        <div className="delivery-dashboard__header">
          <h1>Dobrodošli, {username}! 🚚</h1>
          <p>Upravljajte svojim rasporedom dostave</p>
        </div>

        <div className="dashboard-cards">
          <div 
            className="dashboard-card"
            onClick={() => navigate("/delivery/schedule")}
          >
            <span className="dashboard-card__icon">📅</span>
            <h3>Radno vreme</h3>
            <p>Podesite vaše radno vreme za svaki dan u nedelji</p>
          </div>
        </div>
      </div>
    </div>
  );
}
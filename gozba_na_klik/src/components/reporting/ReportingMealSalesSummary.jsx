import React, { useEffect, useState } from "react";
import { getMealSalesReport } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";
import { getMealsByRestaurantId } from "../service/menuService";

const ReportingMealSalesSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mealId, setMealId] = useState("");
  const [chartType, setChartType] = useState("line");

  const [meals, setMeals] = useState([]);
  const [report, setReport] = useState(null);

  const valid = restaurantId && mealId && startDate && endDate;

  useEffect(() => {
    if (!restaurantId) return;
    getMealsByRestaurantId(restaurantId).then(setMeals);
  }, [restaurantId]);

  useEffect(() => {
    if (!valid) return;

    getMealSalesReport({ restaurantId, mealId, startDate, endDate }).then(setReport);
  }, [restaurantId, mealId, startDate, endDate]);

  return (
    <div className="report-section">
      <h2>Meal Sales Summary</h2>

      {/* FILTERS */}
      <div className="section-filters">
        <div className="filter-group">
          <label>Meal</label>
          <select value={mealId} onChange={e => setMealId(e.target.value)}>
            <option value="">Select meal...</option>
            {meals.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input type="date" onChange={e => setStartDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input type="date" onChange={e => setEndDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label>Chart Type</label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
        </div>
      </div>

      {/* FALLBACKS */}
      {!restaurantId && <p className="no-data">Select a restaurant first.</p>}
      {restaurantId && meals.length === 0 && <p className="no-data">This restaurant has no meals.</p>}
      {restaurantId && !mealId && <p className="no-data">Select a meal.</p>}
      {restaurantId && mealId && !startDate && <p className="no-data">Select start date.</p>}
      {restaurantId && mealId && !endDate && <p className="no-data">Select end date.</p>}
      {valid && !report && <p className="no-data">No data for this period.</p>}

      {/* CONTENT */}
      {valid && report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Total Units Sold:</strong> {report.totalUnitsSold}</p>
            <p><strong>Total Revenue:</strong> {report.totalRevenue}</p>
            <p><strong>Avg Daily Units:</strong> {report.averageDailyUnitsSold}</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Daily Units Sold"
              labels={report.dailyReports.map(r => r.date)}
              data={report.dailyReports.map(r => r.totalDailyUnitsSold)}
              label="Units Sold"
              chartType={chartType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingMealSalesSummary;

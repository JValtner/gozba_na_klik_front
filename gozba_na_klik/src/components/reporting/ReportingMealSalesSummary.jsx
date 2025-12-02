import React, { useEffect, useState } from "react";
import { getMealSalesReport, setPeriod } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";
import { getMealsByRestaurantId } from "../service/menuService";
import { useCurrency } from "../utils/currencyContext";

const ReportingMealSalesSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mealId, setMealId] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [meals, setMeals] = useState([]);
  const [report, setReport] = useState(null);
  const valid = restaurantId && mealId && startDate && endDate;
  const { convert, currency } = useCurrency();
  const [convertedTR, setConvertedTR] = useState(0);

  useEffect(() => {
    if (!report) return;

    convert(report.totalRevenue).then(setConvertedTR);
  }, [report, currency]);

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
      <h2>Statistika zarade jela</h2>

      {/* FILTERS */}
      <div className="section-filters">
        <div className="filter-group">
          <label> 🍜 Jelo</label>
          <select value={mealId} onChange={e => setMealId(e.target.value)}>
            <option value="">Izaberi jelo...</option>
            {meals.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>📅 Period:</label>
          <select onChange={e => setPeriod(Number(e.target.value), setStartDate, setEndDate)}>
            <option value="">Izaberi period...</option>
            <option value="1">1 dan</option>
            <option value="3">3 dana</option>
            <option value="7">7 dana</option>
            <option value="30">30 dana</option>
          </select>
        </div>

        <div className="filter-group">
          <label> 📆 Od:</label>
          <input type="date" onChange={e => setStartDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label> 📆 Do:</label>
          <input type="date" onChange={e => setEndDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label> 📊 Tip grafika: </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="line"> 📈 Linija</option>
            <option value="bar">📊 Stub</option>
          </select>
        </div>
      </div>

      {/* FALLBACKS */}
      {!restaurantId && <p className="no-data">Izaberi restoran.</p>}
      {restaurantId && meals.length === 0 && <p className="no-data">Ovaj restoran ne sadrzi jela.</p>}
      {restaurantId && !mealId && <p className="no-data">Izaberi jelo.</p>}
      {restaurantId && mealId && !startDate && <p className="no-data">Izaberi pocetni datum.</p>}
      {restaurantId && mealId && !endDate && <p className="no-data">Izaberi krajnji datum.</p>}
      {valid && !report && <p className="no-data">Nema podataka za zadati period.</p>}

      {/* CONTENT */}
      {valid && report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Ukupan broj prodatih jedinica:</strong> {report.totalUnitsSold.toLocaleString()} komada</p>
            <p><strong>Ukupan prihod:</strong> {convertedTR.toLocaleString()} {currency}</p>
            <p><strong>Prosecna dnavna prodaja:</strong> {report.averageDailyUnitsSold.toLocaleString()} komada</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Dnevna prodaja jela"
              labels={report.dailyReports.map(r => new Date(r.date).toLocaleDateString())}
              data={report.dailyReports.map(r => r.totalDailyUnitsSold)}
              label="Prodatih jedinica"
              chartType={chartType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingMealSalesSummary;

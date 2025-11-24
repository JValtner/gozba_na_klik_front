import React, { useEffect, useState } from "react";
import { getProfitSummaryReport } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";

const ReportingProfitSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("line");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const valid = restaurantId && startDate && endDate;

  useEffect(() => {
    if (!valid) return;

    setLoading(true);
    getProfitSummaryReport({ restaurantId, startDate, endDate })
      .then(setReport)
      .finally(() => setLoading(false));
  }, [restaurantId, startDate, endDate]);

  return (
    <div className="report-section">
      <h2>Profit Summary</h2>

      {/* FILTERS */}
      <div className="section-filters">
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
      {!restaurantId && <p className="no-data">Select a restaurant.</p>}
      {restaurantId && !startDate && <p className="no-data">Select start date.</p>}
      {restaurantId && !endDate && <p className="no-data">Select end date.</p>}
      {valid && loading && <p>Loading...</p>}
      {valid && !loading && !report && <p className="no-data">No report data.</p>}

      {/* CONTENT */}
      {valid && report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Total Orders:</strong> {report.totalPeriodOrders}</p>
            <p><strong>Total Revenue:</strong> {report.totalRevenue}</p>
            <p><strong>Average Daily Profit:</strong> {report.averageDailyProfit}</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Daily Revenue"
              labels={report.dailyReports.map(r => new Date(r.date).toLocaleDateString())}
              data={report.dailyReports.map(r => r.dailyRevenue)}
              label="Revenue"
              chartType={chartType}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingProfitSummary;

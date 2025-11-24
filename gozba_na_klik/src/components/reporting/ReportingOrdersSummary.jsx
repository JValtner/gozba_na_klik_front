import React, { useEffect, useState } from "react";
import { getOrdersReport } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";

const ReportingOrdersSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("line");

  const [report, setReport] = useState(null);

  const valid = restaurantId && startDate && endDate;

  useEffect(() => {
    if (!valid) return;
    getOrdersReport({ restaurantId, startDate, endDate }).then(setReport);
  }, [restaurantId, startDate, endDate]);

  return (
    <div className="report-section">
      <h2>Orders Summary</h2>

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
      {valid && !report && <p className="no-data">No data available.</p>}

      {/* CONTENT */}
      {valid && report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Total Orders:</strong> {report.totalOrders}</p>
            <p><strong>Cancelled:</strong> {report.totalCancelledOrders}</p>
            <p><strong>Completed:</strong> {report.totalCompletedOrders}</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Daily Orders"
              labels={report.dailyReports.map(r => r.date)}
              data={report.dailyReports.map(r => r.totalOrders)}
              label="Orders"
              chartType={chartType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingOrdersSummary;

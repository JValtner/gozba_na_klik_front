import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";

const ReportingMonthlyReport = ({ restaurantId }) => {
  const [chartType, setChartType] = useState("line");
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    getMonthlyReport(restaurantId).then(data => setReport(data));
  }, [restaurantId]);

  return (
    <div className="report-section">
      <h2>Monthly Report</h2>

      {/* Only chart type */}
      <div className="section-filters">
        <div className="filter-group">
          <label>Chart Type</label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
        </div>
      </div>

      {!restaurantId && <p className="no-data">Select restaurant.</p>}
      {restaurantId && !report && <p>No data.</p>}

      {report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Total Orders:</strong> {report.totalOrders}</p>
            <p><strong>Total Revenue:</strong> {report.totalRevenue}</p>
            <p><strong>Average Order Value:</strong> {report.averageOrderValue}</p>
          </div>

          <div className="chart-box">
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingMonthlyReport;

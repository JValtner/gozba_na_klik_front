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
      <h2>Mesecni izvestaj</h2>

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

      {!restaurantId && <p className="no-data">Izaberi restoran</p>}
      {restaurantId && !report && <p>Nema podataka.</p>}

      {report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Ukupan broj porudzbina:</strong> {report.totalOrders.toLocaleString()}  komada</p>
            <p><strong>Ukupan prihod:</strong> {report.totalRevenue.toLocaleString()} RSD</p>
            <p><strong>Prosecna vrednost porudzbine:</strong> {report.averageOrderValue.toLocaleString()}  RSD</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Top 5 porudzbina za najvecim prihodom"
              labels={report.top5RevenueOrders.items.map(o => `Order #${o.id}`)}
              data={report.top5RevenueOrders.items.map(o => o.totalPrice)}
              label="Prihod"
              chartType={chartType}
            />
          </div>

          <div className="chart-box">
            <DailyChart
              title="Top 5 Najpopularnijih jela"
              labels={report.top5PopularMeals.items.map(i => i.mealName)}
              data={report.top5PopularMeals.items.map(i => i.unitsSold)}
              label="Prodatih jedinica"
              chartType={chartType}
            />
          </div>

          <div className="chart-box">
            <DailyChart
              title="5 Najmanje popularnih jela"
              labels={report.bottom5PopularMeals.items.map(i => i.mealName)}
              data={report.bottom5PopularMeals.items.map(i => i.unitsSold)}
              label="Prodatih jedinica"
              chartType={chartType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingMonthlyReport;

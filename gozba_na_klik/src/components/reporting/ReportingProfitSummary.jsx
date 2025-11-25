import React, { useEffect, useState } from "react";
import { getProfitSummaryReport, setPeriod } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";
import Spinner from "../spinner/Spinner";

const ReportingProfitSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("bar");

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
      <h2>Statistika zarade restorana</h2>

      {/* FILTERS */}
      <div className="section-filters">

        <div className="filter-group">
          <label>Period:</label>
          <select onChange={e => setPeriod(Number(e.target.value), setStartDate, setEndDate)}>
            <option value="">Izaberi period...</option>
            <option value="1">1 dan</option>
            <option value="3">3 dana</option>
            <option value="7">7 dana</option>
            <option value="30">30 dana</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Od:</label>
          <input type="date" onChange={e => setStartDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label>Do:</label>
          <input type="date" onChange={e => setEndDate(new Date(e.target.value).toISOString())} />
        </div>

        <div className="filter-group">
          <label>Tip grafika</label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="line">Linija</option>
            <option value="pie">Pita</option>
            <option value="bar">Stub</option>
          </select>
        </div>
        </div>

      {/* FALLBACKS */}
      {!restaurantId && <p className="no-data">Izaberi restoran.</p>}
      {restaurantId && !startDate && <p className="no-data">Izaberi pocetni datum.</p>}
      {restaurantId && !endDate && <p className="no-data">Izaberi krajnji datum.</p>}
      {valid && !report && <p className="no-data">Nema podataka.</p>}

      {/* CONTENT */}
      {valid && report && (
        <div className="section-content">
          <div className="summary-box">
            <p><strong>Ukupan broj porudzbina:</strong> {report.totalPeriodOrders.toLocaleString()} komada</p>
            <p><strong>Ukupan prihod</strong> {report.totalRevenue.toLocaleString()} RSD</p>
            <p><strong>Prosecan dnevni prihod:</strong> {report.averageDailyProfit.toLocaleString()} RSD</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Dnevni prihod"
              labels={report.dailyReports.map(r => new Date(r.date).toLocaleDateString())}
              data={report.dailyReports.map(r => r.dailyRevenue)}
              label="Prihod"
              chartType={chartType}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingProfitSummary;

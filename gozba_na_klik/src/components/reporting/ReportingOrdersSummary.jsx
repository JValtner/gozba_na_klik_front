import React, { useEffect, useState } from "react";
import { getOrdersReport, setPeriod } from "../service/reportingService";
import DailyChart from "../utils/DailyChart";
import { useCurrency } from "../utils/currencyContext";

const ReportingOrdersSummary = ({ restaurantId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("pie");
  const [report, setReport] = useState(null);
  const valid = restaurantId && startDate && endDate;
  const { convert, currency } = useCurrency();

  
  useEffect(() => {
    if (!valid) return;
    getOrdersReport({ restaurantId, startDate, endDate }).then(setReport);
  }, [restaurantId, startDate, endDate]);

  return (
    <div className="report-section">
      <h2>Statistika porudzbina</h2>

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
            <p><strong>Ukupan broj porudzbina:</strong> {report.totalOrders.toLocaleString()} komada</p>
            <p><strong>Otkazane porudzbine:</strong> {report.totalCancelledOrders.toLocaleString()} komada</p>
            <p><strong>Prihvacene porudzbine:</strong> {report.totalAcceptedOrders.toLocaleString()} komada</p>
            <p><strong>Zavrsene porudzbine:</strong> {report.totalCompletedOrders.toLocaleString()} komada</p>
            <p><strong>Na cekanju porudzbine:</strong> {report.totalPendingOrders.toLocaleString()} komada</p>
            <p><strong>Spremne porudzbine:</strong> {report.totalReadyOrders.toLocaleString()} komada</p>
            <p><strong>Dostavljene porudzbine:</strong> {report.totalCompletedOrders.toLocaleString()} komada</p>
            <p><strong>U dostavi porudzbine:</strong> {report.totalDeliveredOrders.toLocaleString()}komada</p>
          </div>

          <div className="chart-box">
            <DailyChart
              title="Pregled statusa porudzbina"
              labels={[
                "Prihvacene",
                "Otkazane",
                "Zavrsene",
                "Na cekanju",
                "U izporuci",
                "Spremne",
                "Isporucene"
              ]}
              data={[
                report.totalAcceptedOrders,
                report.totalCancelledOrders,
                report.totalCompletedOrders,
                report.totalPendingOrders,
                report.totalInDeliveryOrders,
                report.totalReadyOrders,
                report.totalDeliveredOrders
              ]}
              label="Porudzbine"
              chartType={chartType}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingOrdersSummary;

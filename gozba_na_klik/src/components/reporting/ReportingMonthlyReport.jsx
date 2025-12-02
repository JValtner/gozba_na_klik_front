import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "../service/reportingService";
import { listMonthlySnapshots, downloadSnapshotPdf, downloadOnDemandMonthlyReport, openBlobPdf } from "../service/pdfReportService";
import DailyChart from "../utils/DailyChart";
import MonthlySummary from "./MonthlySummary";
import SnapshotList from "./SnapshotList";

const ReportingMonthlyReport = ({ restaurantId }) => {
  const [chartType, setChartType] = useState("line");
  const [report, setReport] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurantId) return;

    getMonthlyReport(restaurantId).then(setReport).catch(e => setError(e.message));

    listMonthlySnapshots(restaurantId)
      .then(setSnapshots)
      .catch(e => setError(e.message));
  }, [restaurantId]);

  const handleDownloadStored = async (id) => {
    try {
      const blob = await downloadSnapshotPdf(id);
      openBlobPdf(blob, `mesecni-izvestaj-${id}.pdf`);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDownloadOnDemand = async () => {
    try {
      // use the current report DTO from state
      const blob = await downloadOnDemandMonthlyReport(report);
      openBlobPdf(blob, `mesecni-izvestaj-on-demand-${restaurantId}.pdf`);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="report-section">
      <h2>Mesecni izvestaj</h2>

      <div className="section-filters">
        <div className="filter-group">
          <label>📊 Tip grafika: </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="line"> 📈 Linija</option>
            <option value="bar">📊 Stub</option>
            <option value="pie"> ⭕ Pita</option>
          </select>
        </div>
      </div>

      {!restaurantId && <p className="no-data">Izaberi restoran</p>}
      {restaurantId && !report && <p>Nema podataka.</p>}

      {report && (
        <div className="section-content">
          <MonthlySummary report={report} />
          <div className="pdf-actions">
            <button className="btn btn--secondary" onClick={handleDownloadOnDemand}>Preuzmi trenutni izveštaj (PDF)</button>
            <h3>Pregledaj postojece mesecne izvestaje: </h3>
            <SnapshotList snapshots={snapshots} onDownload={handleDownloadStored} />
          </div>

          <div className="chart-box">
            <DailyChart
              title="Top 5 porudzbina sa najvecim prihodom"
              labels={report.top5RevenueOrders.items.map(o => `Order #${o.orderId}`)}
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

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ReportingMonthlyReport;

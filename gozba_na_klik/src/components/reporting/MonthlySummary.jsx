import React from "react";

const MonthlySummary = ({ report }) => {
  return (
    <div className="summary-box">
      <p><strong>Ukupan broj porudzbina:</strong> {report.totalOrders.toLocaleString()} komada</p>
      <p><strong>Ukupan prihod:</strong> {report.totalRevenue.toLocaleString()} RSD</p>
      <p><strong>Prosecna vrednost porudzbine:</strong> {report.averageOrderValue.toLocaleString()} RSD</p>
    </div>
  );
};

export default MonthlySummary;

import React from "react";
import { useEffect, useState } from "react";
import { useCurrency } from "../utils/currencyContext";

const MonthlySummary = ({ report }) => {
  const { convert, currency } = useCurrency();
  const [convertedTR, setConvertedTR] = useState(report.totalRevenue);
  const [convertedAVP, setConvertedAVP] = useState(report.averageOrderValue);

  useEffect(() => {
    convert(report.totalRevenue).then(setConvertedTR);
    convert(report.averageOrderValue).then(setConvertedAVP);
  }, [report.totalRevenue, report.averageOrderValue, currency]);

  return (
    <div className="summary-box">
      <p><strong>Ukupan broj porudzbina:</strong> {report.totalOrders.toLocaleString()} komada</p>
      <p><strong>Ukupan prihod:</strong> {convertedTR.toLocaleString()} {currency}</p>
      <p><strong>Prosecna vrednost porudzbine:</strong> {convertedAVP.toLocaleString()} {currency}</p>
    </div>
  );
};

export default MonthlySummary;

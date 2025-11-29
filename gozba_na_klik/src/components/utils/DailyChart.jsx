import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const DailyChart = ({ title, labels, data, label, chartType }) => {
  const chartData = {
  labels,
  datasets: [
    {
      label,
      data,
      borderColor:
        chartType === "pie"
          ? cssVar("--chart-border") // white border for pie
          : cssVar("--chart-line"),  // green/blue line for line chart
      borderWidth: chartType === "pie" ? 0.5 : 2,
      backgroundColor:
        chartType === "pie"
          ? [
              cssVar("--chart-green"),
              cssVar("--chart-purple"),
              cssVar("--chart-orange"),
              cssVar("--chart-red"),
              cssVar("--chart-blue"),
              cssVar("--chart-yellow"),
            ]
          : cssVar("--chart-fill"),
      tension: 0.3,
      fill: chartType === "line" ? false : true,
    },
  ],
};


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: cssVar("--chart-text") },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: cssVar("--chart-text") },
        grid: { color: cssVar("--chart-grid") },
      },
      y: {
        ticks: { color: cssVar("--chart-text") },
        grid: { color: cssVar("--chart-grid") },
      },
    },
  };

  const renderChart = () => {
    if (chartType === "bar") return <Bar data={chartData} options={chartOptions} />;
    if (chartType === "pie") return <Pie data={chartData} options={chartOptions} />;
    return <Line data={chartData} options={chartOptions} />;
  };

  return (
    <div className="daily-chart">
      <h3>{title}</h3>
      <div className="chart-container">{renderChart()}</div>
    </div>
  );
};

export default DailyChart;

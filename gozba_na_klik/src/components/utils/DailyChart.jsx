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

const DailyChart = ({ title, labels, data, label, chartType }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor:
          chartType === "pie"
            ? [
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ]
            : "rgba(75,192,192,0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      default:
      case "line":
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div style={{ marginBottom: "2rem", height: "280px" }}>
      <h3 style={{ marginBottom: "1rem" }}>{title}</h3>
      {renderChart()}
    </div>
  );
};

export default DailyChart;

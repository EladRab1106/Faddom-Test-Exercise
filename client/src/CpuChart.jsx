import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary chart components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CpuChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        No data available for the selected period.
      </p>
    );
  }

  const labels = data.map((point) =>
    new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const values = data.map((point) => point.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: values,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'CPU (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

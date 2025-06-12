import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { RainfallEntryType } from './barChart';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type Props = {
  data: RainfallEntryType;
};

export default function LineChart({ data }: Props) {
  const labels = data.labels;
  const rainfallData = data.datasets;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Rainfall (mm)',
        data: rainfallData[0].data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Rainfall Trend by Month',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

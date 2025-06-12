import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export type RainfallEntryType = {
  labels: string[],
  datasets: {
      data: number[],
    }[],
};

type Props = {
  data: RainfallEntryType;
};

export default function BarChart({ data }: Props) {
  const labels = data.labels;
  const rainfallData = data.datasets;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Rainfall (mm)',
        data: rainfallData[0].data,
        backgroundColor: rainfallData[0].data ? rainfallData[0].data.map((value) =>
          value >= 50 && value <= 250 ? 'rgba(34, 197, 94, 0.5)' :
          value < 50 ? 'rgba(248, 113, 113, 0.5)' :
          value > 250 ? 'rgba(96, 165, 250, 0.5)' :
          'rgba(34, 197, 94, 0.5)'
        ) : 'rgba(34, 197, 94, 0.5)',
        borderColor: rainfallData[0].data ? rainfallData[0].data.map((value) =>
          value >= 50 && value <= 250 ? 'rgba(34, 197, 94, 1)' :
          value < 50 ? 'rgba(248, 113, 113, 1)' :
          value > 250 ? 'rgba(96, 165, 250, 1)' :
          'rgba(34, 197, 94, 1)'
        ) : 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Rainfall Distribution',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

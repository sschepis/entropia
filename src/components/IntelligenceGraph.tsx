import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IntelligenceData {
  intelligence: number[];
  subjectiveExperience: number[];
  synchronization: number[];
  complexity: number[];
  learningCapacity: number[];
}

interface IntelligenceGraphProps {
  data: IntelligenceData;
}

const IntelligenceGraph: React.FC<IntelligenceGraphProps> = ({ data }) => {
  const chartData = {
    labels: Array.from({ length: data.intelligence.length }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Intelligence',
        data: data.intelligence,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Subjective Experience',
        data: data.subjectiveExperience,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Synchronization',
        data: data.synchronization,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Complexity',
        data: data.complexity,
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
      },
      {
        label: 'Learning Capacity',
        data: data.learningCapacity,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Intelligence Metrics Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="intelligence-graph">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default IntelligenceGraph;

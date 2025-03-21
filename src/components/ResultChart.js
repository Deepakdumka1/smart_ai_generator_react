import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #343a40;
  text-align: center;
`;

const ChartWrapper = styled.div`
  height: ${props => props.height || '300px'};
  width: 100%;
`;

// Performance by Difficulty Chart
export const DifficultyChart = ({ data }) => {
  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Correct Answers',
        data: [
          data.easy?.correct || 0,
          data.medium?.correct || 0,
          data.hard?.correct || 0
        ],
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
      },
      {
        label: 'Incorrect Answers',
        data: [
          data.easy?.incorrect || 0,
          data.medium?.incorrect || 0,
          data.hard?.incorrect || 0
        ],
        backgroundColor: 'rgba(239, 71, 111, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Performance by Difficulty</ChartTitle>
      <ChartWrapper>
        <Bar data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

// Overall Performance Pie Chart
export const OverallPerformanceChart = ({ correct, incorrect }) => {
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correct, incorrect],
        backgroundColor: [
          'rgba(56, 176, 0, 0.7)',
          'rgba(239, 71, 111, 0.7)',
        ],
        borderColor: [
          'rgba(56, 176, 0, 1)',
          'rgba(239, 71, 111, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Overall Performance</ChartTitle>
      <ChartWrapper height="250px">
        <Pie data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

// Topic Mastery Radar Chart
export const TopicMasteryChart = ({ topicScores }) => {
  const labels = Object.keys(topicScores);
  const scores = Object.values(topicScores);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Topic Mastery',
        data: scores,
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(67, 97, 238, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(67, 97, 238, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Topic Mastery</ChartTitle>
      <ChartWrapper>
        <Radar data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

// Response Time Chart
export const ResponseTimeChart = ({ responseTimeData }) => {
  const chartData = {
    labels: responseTimeData.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        label: 'Response Time (seconds)',
        data: responseTimeData,
        backgroundColor: 'rgba(255, 214, 10, 0.7)',
        borderColor: 'rgba(255, 214, 10, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (seconds)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Questions'
        }
      }
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Response Time per Question</ChartTitle>
      <ChartWrapper>
        <Bar data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default {
  DifficultyChart,
  OverallPerformanceChart,
  TopicMasteryChart,
  ResponseTimeChart
};

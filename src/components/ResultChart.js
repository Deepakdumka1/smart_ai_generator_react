
import React, { useEffect, useState } from 'react';
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
import '../styles/responsive.css';

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

// Default chart colors with better contrast
const CHART_COLORS = {
  blue: {
    main: 'rgba(67, 97, 238, 0.7)',
    border: 'rgba(67, 97, 238, 1)',
    light: 'rgba(67, 97, 238, 0.2)'
  },
  red: {
    main: 'rgba(239, 71, 111, 0.7)',
    border: 'rgba(239, 71, 111, 1)',
    light: 'rgba(239, 71, 111, 0.2)'
  },
  green: {
    main: 'rgba(56, 176, 0, 0.7)',
    border: 'rgba(56, 176, 0, 1)',
    light: 'rgba(56, 176, 0, 0.2)'
  },
  yellow: {
    main: 'rgba(255, 214, 10, 0.7)',
    border: 'rgba(255, 214, 10, 1)',
    light: 'rgba(255, 214, 10, 0.2)'
  }
};

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #343a40;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const ChartWrapper = styled.div`
  height: ${props => props.height || '300px'};
  width: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    height: ${props => props.mobileHeight || props.height || '250px'};
  }
  
  @media (max-width: 576px) {
    height: ${props => props.smallMobileHeight || props.mobileHeight || props.height || '200px'};
  }
`;

// Helper text for screen readers
const VisuallyHidden = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Placeholder shown when chart is loading or no data
const ChartPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
  padding: 20px;
  
  @media (max-width: 576px) {
    padding: 10px;
  }
`;

// Custom hook to track screen width
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

// Performance by Difficulty Chart
export const DifficultyChart = ({ data }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 576;
  const isTablet = width <= 768 && width > 576;
  
  // Ensure we have data, even if empty
  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Correct Answers',
        data: [
          data?.easy?.correct || 0,
          data?.medium?.correct || 0,
          data?.hard?.correct || 0
        ],
        backgroundColor: CHART_COLORS.blue.main,
        borderColor: CHART_COLORS.blue.border,
        borderWidth: 1,
      },
      {
        label: 'Incorrect Answers',
        data: [
          data?.easy?.incorrect || 0,
          data?.medium?.incorrect || 0,
          data?.hard?.incorrect || 0
        ],
        backgroundColor: CHART_COLORS.red.main,
        borderColor: CHART_COLORS.red.border,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isMobile ? 'y' : 'x', // Use horizontal bars on mobile for better readability
    scales: {
      x: {
        stacked: false,
        ticks: {
          font: {
            size: isMobile ? 10 : isTablet ? 12 : 14
          }
        },
        grid: {
          display: !isMobile
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          font: {
            size: isMobile ? 10 : isTablet ? 12 : 14
          }
        },
        grid: {
          display: !isMobile
        }
      },
    },
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'top',
        labels: {
          boxWidth: isMobile ? 10 : 20,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 14
        }
      }
    }
  };

  // Check if all data values are zero
  const hasData = chartData.datasets.some(dataset => 
    dataset.data.some(value => value > 0)
  );

  return (
    <ChartContainer className="mobile-full-width">
      <ChartTitle>Performance by Difficulty</ChartTitle>
      <ChartWrapper 
        height="300px" 
        mobileHeight="220px"
      >
        {hasData ? (
          <>
            <VisuallyHidden>
              Performance by difficulty: 
              Easy: {chartData.datasets[0].data[0]} correct, {chartData.datasets[1].data[0]} incorrect.
              Medium: {chartData.datasets[0].data[1]} correct, {chartData.datasets[1].data[1]} incorrect.
              Hard: {chartData.datasets[0].data[2]} correct, {chartData.datasets[1].data[2]} incorrect.
            </VisuallyHidden>
            <Bar data={chartData} options={options} />
          </>
        ) : (
          <ChartPlaceholder>
            <div>No difficulty data available</div>
          </ChartPlaceholder>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

// Overall Performance Pie Chart
export const OverallPerformanceChart = ({ correct, incorrect }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 576;
  
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correct || 0, incorrect || 0],
        backgroundColor: [
          CHART_COLORS.green.main,
          CHART_COLORS.red.main,
        ],
        borderColor: [
          CHART_COLORS.green.border,
          CHART_COLORS.red.border,
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
        labels: {
          boxWidth: isMobile ? 10 : 20,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 14
        },
        callbacks: {
          label: function(context) {
            const total = correct + incorrect;
            const percentage = Math.round((context.raw / total) * 100);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    },
    // Increase cut out percentage on mobile to make the chart more visible
    cutout: isMobile ? '60%' : '50%'
  };

  // Check if there's data to display
  const hasData = correct > 0 || incorrect > 0;
  const total = correct + incorrect;
  const correctPercentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <ChartContainer className="mobile-full-width">
      <ChartTitle>Overall Performance</ChartTitle>
      <ChartWrapper 
        height="250px" 
        mobileHeight="200px"
      >
        {hasData ? (
          <>
            <VisuallyHidden>
              Overall performance: {correct} questions correct ({correctPercentage}%), 
              {incorrect} questions incorrect ({100 - correctPercentage}%)
            </VisuallyHidden>
            <Pie data={chartData} options={options} />
          </>
        ) : (
          <ChartPlaceholder>
            <div>No performance data available</div>
          </ChartPlaceholder>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

// Topic Mastery Radar Chart
export const TopicMasteryChart = ({ topicScores }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 576;
  const isTablet = width <= 768 && width > 576;
  
  const labels = Object.keys(topicScores || {});
  const scores = Object.values(topicScores || {});

  // Limit the number of displayed labels on mobile
  const getDisplayLabels = () => {
    if (isMobile && labels.length > 5) {
      return labels.map(label => 
        label.length > 6 ? `${label.substring(0, 6)}...` : label
      );
    }
    if (isTablet && labels.length > 8) {
      return labels.map(label => 
        label.length > 8 ? `${label.substring(0, 8)}...` : label
      );
    }
    return labels;
  };

  const chartData = {
    labels: getDisplayLabels(),
    datasets: [
      {
        label: 'Topic Mastery',
        data: scores,
        backgroundColor: CHART_COLORS.blue.light,
        borderColor: CHART_COLORS.blue.border,
        borderWidth: isMobile ? 1 : 2,
        pointBackgroundColor: CHART_COLORS.blue.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS.blue.border,
        pointRadius: isMobile ? 2 : 3,
        pointHoverRadius: isMobile ? 3 : 4,
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
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: isMobile ? 25 : 20,
          font: {
            size: isMobile ? 8 : 10
          },
          backdropColor: 'rgba(255, 255, 255, 0.75)'
        },
        pointLabels: {
          font: {
            size: isMobile ? 8 : isTablet ? 9 : 11
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 14
        },
        callbacks: {
          title: function(context) {
            // Use the full topic name in tooltip
            return labels[context[0].dataIndex];
          },
          label: function(context) {
            return `Mastery: ${context.raw}%`;
          }
        }
      }
    }
  };

  // Check if there's data to display
  const hasData = scores.length > 0 && scores.some(score => score > 0);

  return (
    <ChartContainer className="mobile-full-width">
      <ChartTitle>Topic Mastery</ChartTitle>
      <ChartWrapper 
        height="300px"
        mobileHeight="230px"
      >
        {hasData ? (
          <>
            <VisuallyHidden>
              Topic Mastery:
              {labels.map((topic, index) => (
                ` ${topic}: ${scores[index]}%.`
              ))}
            </VisuallyHidden>
            <Radar data={chartData} options={options} />
          </>
        ) : (
          <ChartPlaceholder>
            <div>No topic mastery data available</div>
          </ChartPlaceholder>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

// Response Time Chart
export const ResponseTimeChart = ({ responseTimeData }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 576;
  const isTablet = width <= 768 && width > 576;
  
  // Limit the number of displayed questions on mobile for clarity
  const getDisplayData = () => {
    const data = responseTimeData || [];
    if (isMobile && data.length > 8) {
      // For mobile, either show every other question or limit to recent ones
      return {
        labels: data.map((_, i) => `Q${i+1}`).filter((_, i) => i % 2 === 0 || i >= data.length - 3),
        data: data.filter((_, i) => i % 2 === 0 || i >= data.length - 3)
      };
    }
    return {
      labels: data.map((_, i) => `Q${i+1}`),
      data: data
    };
  };

  const displayData = getDisplayData();

  const chartData = {
    labels: displayData.labels,
    datasets: [
      {
        label: 'Response Time (seconds)',
        data: displayData.data,
        backgroundColor: CHART_COLORS.yellow.main,
        borderColor: CHART_COLORS.yellow.border,
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
          display: !isMobile,
          text: 'Time (seconds)',
          font: {
            size: isMobile ? 10 : isTablet ? 12 : 14
          }
        },
        ticks: {
          font: {
            size: isMobile ? 9 : isTablet ? 10 : 12
          }
        },
        grid: {
          display: !isMobile
        }
      },
      x: {
        title: {
          display: !isMobile,
          text: 'Questions',
          font: {
            size: isMobile ? 10 : isTablet ? 12 : 14
          }
        },
        ticks: {
          font: {
            size: isMobile ? 9 : isTablet ? 10 : 12
          }
        },
        grid: {
          display: !isMobile
        }
      }
    },
    plugins: {
      legend: {
        display: !isMobile,
        position: 'top',
        labels: {
          boxWidth: isMobile ? 10 : 20,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 14
        },
        callbacks: {
          title: function(context) {
            const qIndex = displayData.labels.indexOf(context[0].label);
            const originalIndex = responseTimeData.indexOf(displayData.data[qIndex]);
            return `Question ${originalIndex + 1}`;
          }
        }
      }
    }
  };

  // Check if there's data to display
  const hasData = responseTimeData && responseTimeData.length > 0;

  return (
    <ChartContainer className="mobile-full-width">
      <ChartTitle>Response Time per Question</ChartTitle>
      <ChartWrapper 
        height="300px"
        mobileHeight="220px"
      >
        {hasData ? (
          <>
            <VisuallyHidden>
              Response times:
              {responseTimeData.map((time, i) => (
                ` Question ${i+1}: ${time.toFixed(1)} seconds.`
              ))}
              Average response time: {(responseTimeData.reduce((a, b) => a + b, 0) / responseTimeData.length).toFixed(1)} seconds.
            </VisuallyHidden>
            <Bar data={chartData} options={options} />
          </>
        ) : (
          <ChartPlaceholder>
            <div>No response time data available</div>
          </ChartPlaceholder>
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

// Export named components and default object for backward compatibility
export default {
  DifficultyChart,
  OverallPerformanceChart,
  TopicMasteryChart,
  ResponseTimeChart
};

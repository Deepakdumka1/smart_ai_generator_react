
import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 9px;
  }
  
  @media (max-width: 576px) {
    height: 8px;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    height: 6px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => {
    // Optional: Color changes based on progress
    if (props.progress < 25) return '#3a56d4';
    if (props.progress < 50) return '#4361ee';
    if (props.progress < 75) return '#4895ef';
    return '#4cc9f0';
  }};
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
  
  /* Optional: Add a subtle gradient or pattern for visual interest */
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  
  @media (max-width: 480px) {
    background-size: 15px 15px; /* Smaller pattern on mobile */
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    margin-top: 5px;
  }
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
  
  /* For very small screens, make the text elements stack if needed */
  @media (max-width: 360px) {
    &:last-child {
      margin-top: 4px;
      width: 100%;
      text-align: right;
    }
  }
`;

// Visual progress indicator for accessibility and visual feedback
const ProgressIndicator = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: rgba(255, 255, 255, 0.7);
  animation: pulse 1.5s infinite;
  display: ${props => (props.progress === 100 ? 'none' : 'block')};
  
  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
  
  @media (max-width: 576px) {
    width: 2px;
  }
`;

const ProgressBar = ({ current, total, showInfo = true, label = "Progress" }) => {
  const progress = Math.min(Math.max((current / total) * 100, 0), 100); // Ensure progress stays between 0-100
  const progressId = React.useId(); // Generate unique ID for ARIA

  return (
    <ProgressContainer>
      <ProgressTrack 
        role="progressbar" 
        aria-valuenow={progress} 
        aria-valuemin="0" 
        aria-valuemax="100"
        aria-labelledby={`${progressId}-label`}
      >
        <ProgressFill progress={progress}>
          {progress < 100 && <ProgressIndicator progress={progress} />}
        </ProgressFill>
      </ProgressTrack>
      
      {showInfo && (
        <ProgressInfo>
          <ProgressText id={`${progressId}-label`}>{label}: {current} of {total}</ProgressText>
          <ProgressText>{Math.round(progress)}% Complete</ProgressText>
        </ProgressInfo>
      )}
    </ProgressContainer>
  );
};

// Extended version with additional props for flexibility
const ExtendedProgressBar = ({ 
  current, 
  total, 
  showInfo = true,
  label = "Question",
  hidePercentage = false,
  color,
  height,
  ...props 
}) => {
  return (
    <ProgressBar 
      current={current}
      total={total}
      showInfo={showInfo}
      label={label}
      {...props}
    />
  );
};

export default ProgressBar;

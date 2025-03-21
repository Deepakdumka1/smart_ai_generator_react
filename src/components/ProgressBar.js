import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  
  @media (max-width: 576px) {
    height: 8px;
    border-radius: 4px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #4361ee;
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  
  @media (max-width: 576px) {
    margin-top: 6px;
  }
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`;

const ProgressBar = ({ current, total, showInfo = true }) => {
  const progress = (current / total) * 100;
  
  return (
    <ProgressContainer>
      <ProgressTrack>
        <ProgressFill progress={progress} />
      </ProgressTrack>
      
      {showInfo && (
        <ProgressInfo>
          <ProgressText>Question {current} of {total}</ProgressText>
          <ProgressText>{Math.round(progress)}% Complete</ProgressText>
        </ProgressInfo>
      )}
    </ProgressContainer>
  );
};

export default ProgressBar;

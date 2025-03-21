import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    border-radius: 8px;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 576px) {
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const MetaItem = styled.div`
  background-color: ${props => props.color || '#e9ecef'};
  color: ${props => props.textColor || '#495057'};
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 576px) {
    padding: 4px 10px;
    font-size: 0.8rem;
  }
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 25px;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 576px) {
    gap: 10px;
  }
`;

const Option = styled.button`
  background-color: ${props => 
    props.selected ? '#4361ee' : 
    props.correct ? '#38b000' : 
    props.incorrect ? '#ef476f' : '#f8f9fa'};
  color: ${props => (props.selected || props.correct || props.incorrect) ? 'white' : '#333'};
  padding: 15px 20px;
  border-radius: 8px;
  border: 2px solid ${props => 
    props.selected ? '#3a56d4' : 
    props.correct ? '#2d9200' : 
    props.incorrect ? '#d63e62' : '#e9ecef'};
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 576px) {
    padding: 10px 12px;
    font-size: 0.9rem;
    border-width: 1px;
  }
  
  &:hover {
    background-color: ${props => 
      props.selected ? '#3a56d4' : 
      props.correct ? '#2d9200' : 
      props.incorrect ? '#d63e62' : '#e9ecef'};
    border-color: ${props => 
      props.selected ? '#304ac1' : 
      props.correct ? '#247300' : 
      props.incorrect ? '#c03355' : '#dee2e6'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: ${props => (props.correct || props.incorrect) ? 1 : 0.7};
  }
`;

const FeedbackContainer = styled.div`
  margin-top: 25px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${props => props.correct ? 'rgba(56, 176, 0, 0.1)' : 'rgba(239, 71, 111, 0.1)'};
  border-left: 4px solid ${props => props.correct ? '#38b000' : '#ef476f'};
  
  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 12px;
  }
  
  @media (max-width: 576px) {
    margin-top: 15px;
    padding: 10px;
  }
`;

const FeedbackTitle = styled.h3`
  color: ${props => props.correct ? '#38b000' : '#ef476f'};
  margin-bottom: 10px;
  font-size: 1.1rem;
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 8px;
  }
`;

const FeedbackText = styled.p`
  margin-bottom: 0;
  line-height: 1.5;
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const Timer = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.timeRunningOut ? '#ef476f' : '#495057'};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    align-self: flex-end;
  }
`;

const QuestionCard = ({ 
  question, 
  difficulty, 
  topic, 
  timeLimit = 30,
  onAnswer,
  showFeedback = true
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!answered) {
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(timeLimit);
    setAnswered(false);
    setStartTime(Date.now());
  }, [question.id, timeLimit]);
  
  const handleAnswer = (optionIndex) => {
    // Prevent answering if already answered or if optionIndex is null/undefined
    if (answered || optionIndex === null || optionIndex === undefined) return;
    
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    
    setSelectedOption(optionIndex);
    setAnswered(true);
    
    // Call the parent component's onAnswer function with the answer data
    onAnswer({
      questionId: question.id,
      selectedOption: optionIndex,
      correct: optionIndex === question.correctOption,
      responseTime,
      difficulty: question.difficulty
    });
  };
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy':
        return { bg: '#d8f3dc', text: '#2d6a4f' };
      case 'medium':
        return { bg: '#ffdd00', text: '#664d00' };
      case 'hard':
        return { bg: '#ef476f', text: '#ffffff' };
      default:
        return { bg: '#e9ecef', text: '#495057' };
    }
  };
  
  const difficultyStyle = getDifficultyColor(difficulty);
  
  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionMeta>
          <MetaItem 
            color={difficultyStyle.bg} 
            textColor={difficultyStyle.text}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </MetaItem>
          <MetaItem color="#e0fbfc" textColor="#3d5a80">
            {topic}
          </MetaItem>
        </QuestionMeta>
        <Timer timeRunningOut={timeLeft < 10}>
          {timeLeft}s
        </Timer>
      </QuestionHeader>
      
      <QuestionText>{question.text}</QuestionText>
      
      <OptionsContainer>
        {question.options.map((option, index) => (
          <Option
            key={index}
            selected={selectedOption === index && !answered}
            correct={answered && index === question.correctOption}
            incorrect={answered && selectedOption === index && index !== question.correctOption}
            onClick={() => handleAnswer(index)}
            disabled={answered}
          >
            {option}
          </Option>
        ))}
      </OptionsContainer>
      
      {answered && showFeedback && (
        <FeedbackContainer correct={selectedOption === question.correctOption}>
          <FeedbackTitle correct={selectedOption === question.correctOption}>
            {selectedOption === question.correctOption ? 'Correct!' : 'Incorrect!'}
          </FeedbackTitle>
          <FeedbackText>
            {question.explanation}
          </FeedbackText>
        </FeedbackContainer>
      )}
    </QuestionContainer>
  );
};

export default QuestionCard;

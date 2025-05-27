import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { topicsData } from '../data/topicsData';
import { questionsData } from '../data/questionsData';
import { generateAdaptiveQuestion } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';

const QuizContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const QuizHeader = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const QuizTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    text-align: center;
  }
`;

const QuizInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
  margin-bottom: 20px;
  
  @media (max-width: 992px) {
    gap: 15px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
  
  @media (max-width: 576px) {
    gap: 12px;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
  }
`;

const QuizInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.95rem;
  background-color:rgb(218, 229, 241);
  border-radius: 20px;
  padding: 6px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    max-width: 280px;
  }
`;

const DifficultyInfoItem = styled(QuizInfoItem)`
  background-color: ${props => {
    switch(props.difficulty) {
      case 'easy': return '#d8f3dc';
      case 'medium': return '#ffdd00';
      case 'hard': return '#ef476f';
      default: return '#f8f9fa';
    }
  }};
  
  color: ${props => {
    switch(props.difficulty) {
      case 'easy': return '#2d6a4f';
      case 'medium': return '#664d00';
      case 'hard': return '#ffffff';
      default: return '#6c757d';
    }
  }};
`;

const InfoIcon = styled.span`
  font-size: 1.1rem;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const QuizControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
  
  @media (max-width: 768px) {
    margin-top: 25px;
  }
  
  @media (max-width: 576px) {
    margin-top: 20px;
    flex-direction: column-reverse;
    gap: 10px;
  }
`;

const QuizButton = styled.button`
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: 48px;
  box-shadow: 0 2px 4px rgba(149, 60, 60, 0.1);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 12px 15px;
    min-height: 48px;
  }
`;

const NextButton = styled(QuizButton)`
  background-color: #4361ee;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #3a56d4;
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const QuitButton = styled(QuizButton)`
  background-color: #e9ecef;
  color: #495057;
  
  &:hover:not(:disabled) {
    background-color: #dee2e6;
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 576px) {
    order: 2;
  }
`;

const SubmitButton = styled(QuizButton)`
  background-color:rgb(32, 0, 176);
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #2d9200;
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: center;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 0.9rem;
    margin: 12px 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6c757d;
  font-size: 1.1rem;
  
  @media (max-width: 576px) {
    min-height: 200px;
    font-size: 1rem;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 576px) {
    width: 30px;
    height: 30px;
    border-width: 3px;
    margin-bottom: 10px;
  }
`;

const getHarderDifficulty = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'medium';
    case 'medium': return 'hard';
    case 'hard': return 'hard'; // Stay hard if already hard
    default: return 'medium';
  }
};

const getEasierDifficulty = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'easy'; // Stay easy if already easy
    case 'medium': return 'easy';
    case 'hard': return 'medium';
    default: return 'easy';
  }
};

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { currentUser, addQuizToHistory } = useAuth();
  
  const [topic, setTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [nextQuestionDifficulty, setNextQuestionDifficulty] = useState('medium');
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const initializeQuiz = async () => {
      setIsLoading(true);
      try {
        const foundTopic = topicsData.find(t => t.id === topicId);
        if (foundTopic) {
          setTopic(foundTopic);
          
          const initialQuestion = generateAdaptiveQuestion(
            questionsData.filter(q => q.topicId === topicId),
            'medium',
            []
          );
          
          setQuestions([initialQuestion]);
          setQuizStartTime(Date.now());
          setError(null);
        } else {
          navigate('/topics');
        }
      } catch (err) {
        console.error("Error initializing quiz:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeQuiz();
  }, [topicId, navigate]);
  
  const handleAnswer = (answerData) => {
    setUserAnswers(prev => [...prev, answerData]);
    setError(null);
  };
  
  const handleNextQuestion = () => {
    // Check if we've reached the maximum number of questions
    if (currentQuestionIndex >= 9) {
      handleSubmitQuiz();
      return;
    }

    // Determine the difficulty for the next question based on the last answer
    const lastAnswer = userAnswers[userAnswers.length - 1];
    const newDifficulty = lastAnswer.correct 
      ? getHarderDifficulty(currentDifficulty) 
      : getEasierDifficulty(currentDifficulty);

    setNextQuestionDifficulty(newDifficulty);
    setCurrentDifficulty(newDifficulty);
  
    const newQuestion = generateAdaptiveQuestion(
      questionsData.filter(q => q.topicId === topicId),
      newDifficulty,
      questions
    );
    
    // If no more questions are available, submit the quiz
    if (!newQuestion) {
      handleSubmitQuiz();
      return;
    }
    
    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestionIndex(prev => prev + 1);
    setError(null);
    
    if (windowWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const quizEndTime = Date.now();
      const quizDuration = (quizEndTime - quizStartTime) / 1000;
      
      const correctAnswers = userAnswers.filter(answer => answer.correct).length;
      const totalQuestions = questions.length;
      
      const quizResults = {
        topicId,
        topicName: topic?.name,
        startTime: quizStartTime,
        endTime: quizEndTime,
        duration: quizDuration,
        questions,
        answers: userAnswers,
        totalQuestions,
        correctAnswers,
        scorePercentage: Math.round((correctAnswers / totalQuestions) * 100)
      };
    
      const savedQuiz = await addQuizToHistory(quizResults);
      setIsQuizCompleted(true);
      navigate(`/results/${savedQuiz.quizId}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuitQuiz = () => {
    if (windowWidth <= 576) {
      if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
        navigate('/topics');
      }
    } else {
      if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
        navigate('/topics');
      }
    }
  };
  
  if (isLoading) {
    return (
      <QuizContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div>Loading quiz...</div>
        </LoadingContainer>
      </QuizContainer>
    );
  }
  
  if (!topic) {
    return (
      <QuizContainer>
        <ErrorMessage>
          Quiz topic not found. Please select another topic.
        </ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <QuitButton onClick={() => navigate('/topics')}>
            Back to Topics
          </QuitButton>
        </div>
      </QuizContainer>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= 9;
  const hasAnsweredCurrentQuestion = userAnswers.length > currentQuestionIndex;
  
  return (
    <QuizContainer>
      <QuizHeader>
        <QuizTitle>{topic.name} Quiz</QuizTitle>
        <QuizInfo>
          <QuizInfoItem>
            <InfoIcon role="img" aria-label="topic">📚</InfoIcon>
            <span>Topic: {topic.name}</span>
          </QuizInfoItem>
          <DifficultyInfoItem difficulty={currentDifficulty}>
            <InfoIcon role="img" aria-label="difficulty">🔥</InfoIcon>
            <span>Difficulty: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}</span>
          </DifficultyInfoItem>
          <QuizInfoItem>
            <InfoIcon role="img" aria-label="questions">❓</InfoIcon>
            <span>Question {currentQuestionIndex + 1} of 10</span>
          </QuizInfoItem>
        </QuizInfo>
        
        <ProgressBar current={currentQuestionIndex + 1} total={10} />
      </QuizHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {currentQuestion && !isQuizCompleted && (
        <QuestionCard 
          key={`question-${currentQuestionIndex}-${currentQuestion.id}`}
          question={currentQuestion}
          difficulty={currentDifficulty}
          topic={topic.name}
          onAnswer={handleAnswer}
          showFeedback={true}
        />
      )}
      
      <QuizControls>
        <QuitButton 
          onClick={handleQuitQuiz}
          disabled={isSubmitting}
        >
          {windowWidth <= 576 ? 'Quit' : 'Quit Quiz'}
        </QuitButton>
        
        {isLastQuestion && hasAnsweredCurrentQuestion ? (
          <SubmitButton 
            onClick={handleSubmitQuiz}
            disabled={isSubmitting || isQuizCompleted}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </SubmitButton>
        ) : (
          <NextButton 
            onClick={handleNextQuestion} 
            disabled={!hasAnsweredCurrentQuestion || isSubmitting || isQuizCompleted}
          >
            Next Question
          </NextButton>
        )}
      </QuizControls>
    </QuizContainer>
  );
};

export default Quiz;
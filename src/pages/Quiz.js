
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { topicsData } from '../data/topicsData';
import { questionsData } from '../data/questionsData';
import { generateAdaptiveQuestion } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';

const QuizContainer = styled.div``;

const QuizHeader = styled.div`
  margin-bottom: 30px;
`;

const QuizTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const QuizInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const QuizInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.95rem;
`;

const QuizControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const QuizButton = styled.button`
  padding: 12px 25px;
  border-radius: 5px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NextButton = styled(QuizButton)`
  background-color: #4361ee;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #3a56d4;
  }
`;

const QuitButton = styled(QuizButton)`
  background-color: #e9ecef;
  color: #495057;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const SubmitButton = styled(QuizButton)`
  background-color: #38b000;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #2d9200;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 10px;
  text-align: center;
`;

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
  
  useEffect(() => {
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
  }, [topicId, navigate]);
  
  const handleAnswer = (answerData) => {
    setUserAnswers(prev => [...prev, answerData]);
    
    const newDifficulty = answerData.correct ? 
      getHarderDifficulty(currentDifficulty) : 
      getEasierDifficulty(currentDifficulty);
    
    setNextQuestionDifficulty(newDifficulty);
    setError(null);
  };
  
  const getHarderDifficulty = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'medium';
      case 'medium': return 'hard';
      case 'hard': return 'hard';
      default: return 'medium';
    }
  };
  
  const getEasierDifficulty = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'easy';
      case 'hard': return 'medium';
      default: return 'easy';
    }
  };
  
  const handleNextQuestion = () => {
    setCurrentDifficulty(nextQuestionDifficulty);
    
    const newQuestion = generateAdaptiveQuestion(
      questionsData.filter(q => q.topicId === topicId),
      nextQuestionDifficulty,
      questions
    );
    
    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestionIndex(prev => prev + 1);
    setError(null);
  };
  
  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const quizEndTime = Date.now();
      const quizDuration = (quizEndTime - quizStartTime) / 1000;
      
      // Calculate correct answers
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
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      navigate('/topics');
    }
  };
  
  if (!topic) {
    return <div>Loading...</div>;
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
            <span role="img" aria-label="topic">📚</span> Topic: {topic.name}
          </QuizInfoItem>
          <QuizInfoItem>
            <span role="img" aria-label="difficulty">🔥</span> Current Difficulty: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
          </QuizInfoItem>
          <QuizInfoItem>
            <span role="img" aria-label="questions">❓</span> Question {currentQuestionIndex + 1} of {isLastQuestion ? 10 : '10'}
          </QuizInfoItem>
        </QuizInfo>
        
        <ProgressBar current={currentQuestionIndex + 1} total={10} />
      </QuizHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {currentQuestion && !isQuizCompleted && (
        <QuestionCard 
          key={`question-${currentQuestionIndex}-${currentQuestion.id}`}
          question={currentQuestion}
          difficulty={currentQuestion.difficulty}
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
          Quit Quiz
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

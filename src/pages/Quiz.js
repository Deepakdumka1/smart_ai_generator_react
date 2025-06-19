import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import './Quiz.css';
=======

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
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803

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
  const { currentUser } = useAuth();
  
  // State management
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 10,
    difficulty: 'all',
    timeLimit: true
  });

  const timerRef = useRef(null);

  // Timer effect
=======
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803
  useEffect(() => {
    if (quizStarted && quizSettings.timeLimit && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      // Auto-submit when time runs out
      handleNextQuestion();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
<<<<<<< HEAD
  }, [timeLeft, quizStarted, quizSettings.timeLimit]);

  // Load quiz data on component mount
  useEffect(() => {
    if (topicId) {
      loadQuizData();
    }
  }, [topicId]);

  const loadQuizData = async () => {
=======
    
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
    
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading quiz data for topic:', topicId);
      
<<<<<<< HEAD
      // Fetch topic information
      const topicQuery = query(collection(db, 'topics'), where('id', '==', topicId));
      const topicSnapshot = await getDocs(topicQuery);
      
      if (topicSnapshot.empty) {
        setError('Topic not found. Please select a valid topic.');
        setLoading(false);
        return;
      }
      
      const topicData = { firebaseId: topicSnapshot.docs[0].id, ...topicSnapshot.docs[0].data() };
      setTopic(topicData);
      
      // Fetch questions for this topic
      let questionsQuery = query(
        collection(db, 'questions'),
        where('topicId', '==', topicId),
        where('isActive', '==', true)
      );
      
      // Add difficulty filter if specified
      if (quizSettings.difficulty !== 'all') {
        questionsQuery = query(questionsQuery, where('difficulty', '==', quizSettings.difficulty));
      }
      
      const questionsSnapshot = await getDocs(questionsQuery);
      
      if (questionsSnapshot.empty) {
        setError('No questions found for this topic. Please try another topic.');
        setLoading(false);
        return;
      }
      
      // Process questions
      let questionsData = questionsSnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
      
      // Shuffle questions for randomness
      questionsData = questionsData.sort(() => Math.random() - 0.5);
      
      // Limit to requested number of questions
      questionsData = questionsData.slice(0, Math.min(quizSettings.questionCount, questionsData.length));
      
      console.log(`Loaded ${questionsData.length} questions for quiz`);
      setQuestions(questionsData);
      setLoading(false);
=======
      const correctAnswers = userAnswers.filter(answer => answer.correct).length;
      const totalQuestions = questions.length;
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803
      
    } catch (error) {
      console.error('Error loading quiz data:', error);
      setError('Failed to load quiz. Please try again.');
      setLoading(false);
    }
  };
<<<<<<< HEAD

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Save the answer (or null if no answer selected)
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30); // Reset timer
=======
  
  const handleQuitQuiz = () => {
    if (windowWidth <= 576) {
      if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
        navigate('/topics');
      }
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803
    } else {
      // Quiz completed
      finishQuiz(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setTimeLeft(30); // Reset timer
    }
  };

  const finishQuiz = (finalAnswers) => {
    const quizEndTime = Date.now();
    const timeSpent = Math.floor((quizEndTime - quizStartTime) / 1000); // in seconds
    
    // Calculate results
    let correctAnswers = 0;
    const detailedResults = questions.map((question, index) => {
      const userAnswer = finalAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        options: question.options,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || 'No explanation available'
      };
    });
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    // Navigate to results page with quiz data
    navigate('/results', {
      state: {
        topicId: topicId,
        topicName: topic.name,
        score: correctAnswers,
        totalQuestions: questions.length,
        correctAnswers: correctAnswers,
        percentage: percentage,
        timeSpent: timeSpent,
        difficulty: quizSettings.difficulty,
        answers: finalAnswers,
        questions: questions,
        detailedResults: detailedResults
      }
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizStarted(false);
    setTimeLeft(30);
    // Reload questions with new randomization
    loadQuizData();
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }
<<<<<<< HEAD

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Quiz</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={loadQuizData} className="retry-btn">
              Try Again
            </button>
            <button onClick={() => navigate('/topics')} className="back-btn">
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-setup">
          <div className="topic-info">
            <div className="topic-icon" style={{ backgroundColor: topic.color }}>
              {topic.icon}
            </div>
            <h1>{topic.name}</h1>
            <p>{topic.description}</p>
          </div>
          
          <div className="quiz-settings">
            <h3>Quiz Settings</h3>
            
            <div className="setting-group">
              <label>Number of Questions:</label>
              <select 
                value={quizSettings.questionCount}
                onChange={(e) => {
                  setQuizSettings({...quizSettings, questionCount: parseInt(e.target.value)});
                  loadQuizData(); // Reload with new settings
                }}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Difficulty:</label>
              <select 
                value={quizSettings.difficulty}
                onChange={(e) => {
                  setQuizSettings({...quizSettings, difficulty: e.target.value});
                  loadQuizData(); // Reload with new difficulty
                }}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>
                <input 
                  type="checkbox"
                  checked={quizSettings.timeLimit}
                  onChange={(e) => setQuizSettings({...quizSettings, timeLimit: e.target.checked})}
                />
                Enable time limit (30 seconds per question)
              </label>
            </div>
          </div>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-label">Available Questions:</span>
              <span className="info-value">{questions.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quiz Duration:</span>
              <span className="info-value">
                {quizSettings.timeLimit ? `~${Math.ceil(quizSettings.questionCount * 0.5)} minutes` : 'No limit'}
              </span>
            </div>
          </div>
          
          <div className="quiz-actions">
            <button 
              onClick={startQuiz} 
              className="start-quiz-btn" 
              disabled={questions.length === 0}
            >
              Start Quiz
            </button>
            <button onClick={() => navigate('/topics')} className="back-btn">
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizStarted) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          {quizSettings.timeLimit && (
            <div className="timer">
              <div className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''}`}>
                {timeLeft}
              </div>
            </div>
          )}
        </div>
        
        <div className="question-container">
          <div className="question-header">
            <span className="question-difficulty">{currentQuestion.difficulty}</span>
            <h2 className="question-text">{currentQuestion.question}</h2>
          </div>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
          
          <div className="quiz-navigation">
            <button 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="nav-btn prev-btn"
            >
              Previous
            </button>
            
            <button 
              onClick={handleNextQuestion}
              className="nav-btn next-btn"
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
=======
  
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
>>>>>>> cb179decc8f5f44e5e1d172cb514eec530cd4803
};

export default Quiz;
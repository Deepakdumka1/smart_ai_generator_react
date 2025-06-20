import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 10,
    difficulty: 'all',
    timeLimit: true
  });

  const timerRef = useRef(null);

  // Timer effect
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
  }, [timeLeft, quizStarted, quizSettings.timeLimit]);

  // Load quiz data whenever settings change or topic changes
  useEffect(() => {
    if (topicId) {
      loadQuizData();
    }
  }, [topicId, quizSettings.difficulty, quizSettings.questionCount]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading quiz data for topic:', topicId);
      
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
      
      // Fetch questions for this topic with the selected difficulty
      let questionsQuery;
      
      if (quizSettings.difficulty === 'all') {
        // If 'all' difficulties are selected, don't filter by difficulty
        questionsQuery = query(
          collection(db, 'questions'),
          where('topicId', '==', topicId),
          where('isActive', '==', true)
        );
      } else {
        // Filter by the selected difficulty
        questionsQuery = query(
          collection(db, 'questions'),
          where('topicId', '==', topicId),
          where('difficulty', '==', quizSettings.difficulty),
          where('isActive', '==', true)
        );
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
      
    } catch (error) {
      console.error('Error loading quiz data:', error);
      setError('Failed to load quiz. Please try again.');
      setLoading(false);
    }
  };

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

  const handleQuitQuiz = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      navigate('/topics');
    }
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
            <div className="topic-icon" style={{ backgroundColor: topic?.color }}>
              {topic?.icon}
            </div>
            <h1>{topic?.name}</h1>
            <p>{topic?.description}</p>
          </div>
          
          <div className="quiz-settings">
            <h3>Quiz Settings</h3>
            
            <div className="form-group">
              <label>Number of Questions:</label>
              <select 
                value={quizSettings.questionCount}
                onChange={(e) => setQuizSettings(prev => ({
                  ...prev, 
                  questionCount: parseInt(e.target.value)
                }))}
                className="form-control"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={50}>50 Questions</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Difficulty Level:</label>
              <select 
                value={quizSettings.difficulty}
                onChange={(e) => setQuizSettings(prev => ({
                  ...prev, 
                  difficulty: e.target.value
                }))}
                className="form-control"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={quizSettings.timeLimit}
                  onChange={(e) => setQuizSettings(prev => ({
                    ...prev,
                    timeLimit: e.target.checked
                  }))}
                />
                Enable Time Limit (30s per question)
              </label>
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
                disabled={questions.length === 0 || loading}
              >
                {loading ? 'Loading...' : 'Start Quiz'}
              </button>
              <button 
                onClick={() => navigate('/topics')} 
                className="back-btn"
              >
                Back to Topics
              </button>
            </div>
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
              onClick={handleQuitQuiz}
              className="nav-btn quit-btn"
            >
              Quit Quiz
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
};

export default Quiz;
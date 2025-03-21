import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import styled, { keyframes } from 'styled-components';
import {
  DifficultyChart,
  OverallPerformanceChart,
  TopicMasteryChart,
  ResponseTimeChart
} from '../components/ResultChart';
import { getTopicRecommendations } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';
import '../styles/responsive.css';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Skeleton loaders
const SkeletonBox = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: 8px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.mb || '10px'};
`;

const ResultsContainer = styled.div`
  padding: 20px 15px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
  
  @media (max-width: 576px) {
    padding: 10px;
  }
`;

const ResultsHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const ResultsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const ResultsSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0 10px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ScoreSummary = styled.div`
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(67, 97, 238, 0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    margin-bottom: 25px;
    border-radius: 8px;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 3px 10px rgba(67, 97, 238, 0.15);
  }
`;

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 5px;
  }
  
  @media (max-width: 576px) {
    font-size: 2.5rem;
    margin-bottom: 3px;
  }
`;

const ScoreLabel = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 25px;
  }
  
  @media (max-width: 576px) {
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #343a40;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #4361ee, #3a0ca3);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.3rem;
    margin-bottom: 12px;
    padding-bottom: 8px;
    
    &:after {
      width: 40px;
      height: 2px;
    }
  }
`;

const RecommendationsSection = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const RecommendationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const RecommendationCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-left: 5px solid #4361ee;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
    border-radius: 6px;
    border-left-width: 4px;
  }
`;

const RecommendationTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;

const RecommendationText = styled.p`
  color: #6c757d;
  margin-bottom: 15px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    margin-bottom: 10px;
    line-height: 1.4;
  }
`;

const RecommendationButton = styled(Link)`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: #3a56d4;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 7px 12px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
    padding: 10px 15px;
  }
`;

const QuestionReviewSection = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const QuestionReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
  
  @media (max-width: 576px) {
    gap: 10px;
  }
`;

const QuestionReviewItem = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-left: 5px solid ${props => props.correct ? '#38b000' : '#ef476f'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
    border-radius: 6px;
    border-left-width: 4px;
  }
`;

const QuestionText = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
    margin-bottom: 6px;
  }
`;

const AnswerInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 8px;
  }
  
  @media (max-width: 576px) {
    gap: 8px;
    margin-bottom: 6px;
    flex-direction: column;
  }
`;

const AnswerItem = styled.div`
  font-size: 0.95rem;
  color: #6c757d;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding-bottom: 5px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  strong {
    color: #495057;
  }
`;

const ExplanationBox = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #495057;
  
  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 576px) {
    padding: 6px 8px;
    font-size: 0.8rem;
    margin-top: 8px;
  }
  
  strong {
    color: #212529;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-top: 30px;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 12px;
    margin-top: 25px;
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  border-radius: 5px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 576px) {
    padding: 12px 15px;
    font-size: 0.9rem;
    width: 100%;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #4361ee;
  color: white;
  
  &:hover {
    background-color: #3a56d4;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #e9ecef;
  color: #495057;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #ef476f;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
    
    @media (max-width: 576px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    color: #6c757d;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
    
    @media (max-width: 576px) {
      font-size: 0.9rem;
    }
  }
`;

const LoadingContainer = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 30px 15px;
  }
  
  @media (max-width: 576px) {
    padding: 20px 10px;
  }
`;

// Skeleton loader for results page
const ResultsSkeleton = () => (
  <LoadingContainer>
    <div className="text-center mb-4">
      <SkeletonBox height="40px" width="60%" style={{ margin: '0 auto' }} mb="15px" />
      <SkeletonBox height="20px" width="80%" style={{ margin: '0 auto' }} />
    </div>
    
    <SkeletonBox height="150px" mb="30px" />
    
    <div style={{ marginBottom: '30px' }}>
      <SkeletonBox height="30px" width="150px" mb="20px" />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px'
      }}>
        <SkeletonBox height="250px" />
        <SkeletonBox height="250px" />
      </div>
    </div>
    
    <SkeletonBox height="30px" width="180px" mb="20px" />
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '15px',
      marginBottom: '30px'
    }}>
      <SkeletonBox height="150px" />
      <SkeletonBox height="150px" />
    </div>
    
    <SkeletonBox height="30px" width="150px" mb="20px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
      <SkeletonBox height="120px" />
      <SkeletonBox height="120px" />
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <SkeletonBox height="45px" width="150px" />
      <SkeletonBox height="45px" width="150px" />
    </div>
  </LoadingContainer>
);

const Results = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Toggle question explanation
  const toggleQuestionExpand = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const loadQuizResults = async () => {
      try {
        setLoading(true);
        
        if (!quizId) {
          throw new Error('Quiz ID is missing');
        }
        
        // Security check - only load if user is logged in
        if (!currentUser?.uid) {
          navigate('/login', { state: { from: `/results/${quizId}` } });
          return;
        }
        
        const quizRef = doc(db, 'quizHistory', quizId);
        const quizDoc = await getDoc(quizRef);
        
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          
          // Security check - ensure user only sees their own quiz results
          if (quizData.userId !== currentUser.uid) {
            throw new Error('You do not have permission to view these results');
          }
          
          setQuizResults(quizData);
          
          // Generate recommendations based on results
          const topicRecommendations = getTopicRecommendations(quizData);
          setRecommendations(topicRecommendations);
        } else {
          throw new Error('Quiz results not found');
        }
      } catch (err) {
        console.error('Error loading quiz results:', err);
        setError(err.message || 'Failed to load quiz results');
      } finally {
        // Add a slight delay to prevent layout shifts
        setTimeout(() => setLoading(false), 500);
      }
    };

    loadQuizResults();
  }, [quizId, currentUser, navigate]);

  if (loading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <PrimaryButton to="/topics" className="mobile-full-width">
          Return to Topics
        </PrimaryButton>
      </ErrorContainer>
    );
  }

  if (!quizResults) {
    return (
      <ErrorContainer>
        <h2>No Results Found</h2>
        <p>The quiz results you're looking for don't exist or have been removed.</p>
        <PrimaryButton to="/topics" className="mobile-full-width">
          Explore Topics
        </PrimaryButton>
      </ErrorContainer>
    );
  }

  // Calculate overall score
  const correctAnswers = quizResults.answers.filter(answer => answer.correct).length;
  const totalQuestions = quizResults.questions.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Prepare data for charts
  const difficultyData = {
    easy: { correct: 0, incorrect: 0 },
    medium: { correct: 0, incorrect: 0 },
    hard: { correct: 0, incorrect: 0 }
  };

  quizResults.answers.forEach((answer, index) => {
    const question = quizResults.questions[index];
    const difficulty = question.difficulty;

    if (answer.correct) {
      difficultyData[difficulty].correct += 1;
    } else {
      difficultyData[difficulty].incorrect += 1;
    }
  });

  // Response time data
  const responseTimeData = quizResults.answers.map(answer => answer.responseTime);

  // Topic mastery data (simplified for demo)
  const topicMasteryData = {
    [quizResults.topicName]: scorePercentage,
    // In a real app, you would have more topics here based on user history
  };

  // Determine score level for conditional UI elements
  const scoreLevel = 
    scorePercentage >= 80 ? 'excellent' :
    scorePercentage >= 60 ? 'good' :
    scorePercentage >= 40 ? 'average' : 'needs-improvement';

  return (
    <ResultsContainer className="fade-in">
      <ResultsHeader>
        <ResultsTitle>Quiz Results</ResultsTitle>
        <ResultsSubtitle>
          Here's how you performed on the {quizResults.topicName} quiz
        </ResultsSubtitle>
      </ResultsHeader>

      <ScoreSummary className={`score-${scoreLevel}`}>
        <ScoreValue>{scorePercentage}%</ScoreValue>
        <ScoreLabel>
          You answered {correctAnswers} out of {totalQuestions} questions correctly
        </ScoreLabel>
      </ScoreSummary>

      <ChartsGrid className="mobile-stack">
        <OverallPerformanceChart
          correct={correctAnswers}
          incorrect={totalQuestions - correctAnswers}
        />

        <DifficultyChart data={difficultyData} />

        {/* Render charts conditionally based on screen size */}
        <div className="d-none d-md-block">
          <ResponseTimeChart responseTimeData={responseTimeData} />
        </div>

        <TopicMasteryChart topicScores={topicMasteryData} />
        
        {/* Show this chart only on mobile */}
        <div className="d-md-none">
          <ResponseTimeChart responseTimeData={responseTimeData} />
        </div>
      </ChartsGrid>

      <RecommendationsSection>
        <SectionTitle>Recommendations</SectionTitle>
        <RecommendationsList>
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} className="mobile-full-width">
              <RecommendationTitle>{recommendation.title}</RecommendationTitle>
              <RecommendationText>{recommendation.description}</RecommendationText>
              {recommendation.topicId && (
                <RecommendationButton to={`/quiz/${recommendation.topicId}`}>
                  Start Quiz
                </RecommendationButton>
              )}
            </RecommendationCard>
          ))}
        </RecommendationsList>
      </RecommendationsSection>

      <QuestionReviewSection>
        <SectionTitle>Question Review</SectionTitle>
        <QuestionReviewList>
          {quizResults.questions.map((question, index) => {
            const answer = quizResults.answers[index];
            const isCorrect = answer?.correct || false;
            const isExpanded = expandedQuestions[index] || false;

            return (
              <QuestionReviewItem 
                key={index} 
                correct={isCorrect} 
                className="mobile-full-width"
                onClick={() => toggleQuestionExpand(index)}
                style={{ cursor: 'pointer' }}
              >
                <QuestionText>
                  {index + 1}. {question.text}
                </QuestionText>
                <AnswerInfo>
                  <AnswerItem>
                    <strong>Your answer:</strong> {answer?.selectedOption !== null ?
                      question.options[answer.selectedOption] :
                      'No answer provided'}
                  </AnswerItem>
                  <AnswerItem>
                    <strong>Correct answer:</strong> {question.options[question.correctOption]}
                  </AnswerItem>
                  <AnswerItem>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </AnswerItem>
                  <AnswerItem>
                    <strong>Response time:</strong> {answer?.responseTime.toFixed(2)}s
                  </AnswerItem>
                </AnswerInfo>
                
                {/* Collapsible explanation section */}
                {question.explanation && (
                  <ExplanationBox 
                    className={isExpanded ? 'fade-in' : 'd-none'}
                  >
                    <strong>Explanation:</strong> {question.explanation}
                  </ExplanationBox>
                )}
                
                {/* Show hint if not expanded and there's an explanation */}
                {question.explanation && !isExpanded && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6c757d', 
                    textAlign: 'center',
                    marginTop: '5px'
                  }}>
                    Tap to view explanation
                  </div>
                )}
              </QuestionReviewItem>
            );
          })}
        </QuestionReviewList>
      </QuestionReviewSection>

      <ButtonsContainer>
        <PrimaryButton to={`/quiz/${quizResults.topicId}`} className="mobile-full-width">
          Retake Quiz
        </PrimaryButton>
        <SecondaryButton to="/topics" className="mobile-full-width">
          Explore More Topics
        </SecondaryButton>
      </ButtonsContainer>
    </ResultsContainer>
  );
};

export default Results;
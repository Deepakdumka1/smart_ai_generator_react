import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Add this import
import { db } from '../config/firebase'; // Add this import
import styled from 'styled-components';
import {
  DifficultyChart,
  OverallPerformanceChart,
  TopicMasteryChart,
  ResponseTimeChart
} from '../components/ResultChart';
import { getTopicRecommendations } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';

const ResultsContainer = styled.div`
  padding: 0 15px;
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const ResultsHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
`;

const ResultsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
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
`;

const ScoreSummary = styled.div`
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    margin-bottom: 25px;
    border-radius: 8px;
  }
`;

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 5px;
  }
`;

const ScoreLabel = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 25px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
`;

const RecommendationsSection = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
`;

const RecommendationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const RecommendationCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-left: 5px solid #4361ee;
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
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
`;

const RecommendationText = styled.p`
  color: #6c757d;
  margin-bottom: 15px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
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
  transition: background-color 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 7px 12px;
    font-size: 0.85rem;
    width: 100%;
    text-align: center;
  }
  
  &:hover {
    background-color: #3a56d4;
  }
`;

const QuestionReviewSection = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
`;

const QuestionReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const QuestionReviewItem = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-left: 5px solid ${props => props.correct ? '#38b000' : '#ef476f'};
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
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
`;

const AnswerItem = styled.div`
  font-size: 0.95rem;
  color: #6c757d;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    width: 100%;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
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
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.95rem;
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

const Results = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuizResults = async () => {
      try {
        setLoading(true);
        const quizRef = doc(db, 'quizHistory', quizId);
        const quizDoc = await getDoc(quizRef);
        
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setQuizResults(quizData);
          
          // Generate recommendations based on results
          const topicRecommendations = getTopicRecommendations(quizData);
          setRecommendations(topicRecommendations);
        } else {
          setError('Quiz results not found');
        }
      } catch (err) {
        console.error('Error loading quiz results:', err);
        setError('Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    loadQuizResults();
  }, [quizId]);

  if (loading) {
    return <div>Loading results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quizResults) {
    return <div>No results found</div>;
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

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>Quiz Results</ResultsTitle>
        <ResultsSubtitle>
          Here's how you performed on the {quizResults.topicName} quiz
        </ResultsSubtitle>
      </ResultsHeader>

      <ScoreSummary>
        <ScoreValue>{scorePercentage}%</ScoreValue>
        <ScoreLabel>
          You answered {correctAnswers} out of {totalQuestions} questions correctly
        </ScoreLabel>
      </ScoreSummary>

      <ChartsGrid>
        <OverallPerformanceChart
          correct={correctAnswers}
          incorrect={totalQuestions - correctAnswers}
        />

        <DifficultyChart data={difficultyData} />

        <ResponseTimeChart responseTimeData={responseTimeData} />

        <TopicMasteryChart topicScores={topicMasteryData} />
      </ChartsGrid>

      <RecommendationsSection>
        <SectionTitle>Recommendations</SectionTitle>
        <RecommendationsList>
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index}>
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

            return (
              <QuestionReviewItem key={index} correct={isCorrect}>
                <QuestionText>{question.text}</QuestionText>
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
                {question.explanation && (
                  <div>
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </QuestionReviewItem>
            );
          })}
        </QuestionReviewList>
      </QuestionReviewSection>

      <ButtonsContainer>
        <PrimaryButton to={`/quiz/${quizResults.topicId}`}>
          Retake Quiz
        </PrimaryButton>
        <SecondaryButton to="/topics">
          Explore More Topics
        </SecondaryButton>
      </ButtonsContainer>
    </ResultsContainer>
  );
};

export default Results;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { topicsData } from '../../data/topicsData';

const ListContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ListTitle = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionCard = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 15px;
`;

const QuestionTopic = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const QuestionDifficulty = styled.span`
  background: ${props => 
    props.difficulty === 'easy' ? '#28a745' :
    props.difficulty === 'medium' ? '#ffc107' : '#dc3545'
  };
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
`;

const QuestionText = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
  line-height: 1.4;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0;
`;

const OptionItem = styled.li`
  padding: 8px 15px;
  margin: 5px 0;
  border-radius: 8px;
  background: ${props => props.isCorrect ? '#d4edda' : '#f8f9fa'};
  border: 1px solid ${props => props.isCorrect ? '#c3e6cb' : '#e9ecef'};
  color: ${props => props.isCorrect ? '#155724' : '#333'};
  font-weight: ${props => props.isCorrect ? '600' : 'normal'};
`;

const ExplanationText = styled.p`
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  color: #0d47a1;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const EditButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #218838;
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #c82333;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const NoQuestionsMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 12px;
`;

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, selectedTopic, selectedDifficulty]);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customQuestions'));
      const questionsData = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topicId === selectedTopic);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleDeleteQuestion = async (docId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteDoc(doc(db, 'customQuestions', docId));
        setQuestions(prev => prev.filter(q => q.docId !== docId));
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };

  const getTopicName = (topicId) => {
    const topic = topicsData.find(t => t.id === topicId);
    return topic ? topic.name : topicId;
  };

  if (loading) {
    return <LoadingMessage>Loading questions...</LoadingMessage>;
  }

  return (
    <ListContainer>
      <ListTitle>Manage Questions</ListTitle>
      
      <FilterContainer>
        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>Filter by Topic:</label>
          <FilterSelect
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">All Topics</option>
            {topicsData.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </FilterSelect>
        </div>
        
        <div>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>Filter by Difficulty:</label>
          <FilterSelect
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </FilterSelect>
        </div>
      </FilterContainer>

      {filteredQuestions.length === 0 ? (
        <NoQuestionsMessage>
          {questions.length === 0 ? 
            'No custom questions found. Add some questions to get started!' :
            'No questions match the selected filters.'}
        </NoQuestionsMessage>
      ) : (
        <QuestionsContainer>
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.docId}>
              <QuestionHeader>
                <div>
                  <QuestionTopic>{getTopicName(question.topicId)}</QuestionTopic>
                  <QuestionDifficulty difficulty={question.difficulty}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </QuestionDifficulty>
                </div>
              </QuestionHeader>
              
              <QuestionText>{question.text}</QuestionText>
              
              <OptionsList>
                {question.options.map((option, index) => (
                  <OptionItem 
                    key={index} 
                    isCorrect={index === question.correctOption}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                    {index === question.correctOption && ' ✓'}
                  </OptionItem>
                ))}
              </OptionsList>
              
              <ExplanationText>
                <strong>Explanation:</strong> {question.explanation}
              </ExplanationText>
              
              <ButtonContainer>
                <DeleteButton onClick={() => handleDeleteQuestion(question.docId)}>
                  Delete Question
                </DeleteButton>
              </ButtonContainer>
            </QuestionCard>
          ))}
        </QuestionsContainer>
      )}
    </ListContainer>
  );
};

export default QuestionsList;
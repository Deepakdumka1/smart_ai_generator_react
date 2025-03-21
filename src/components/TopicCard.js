import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 160px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #343a40;
`;

const CardDescription = styled.p`
  color: #6c757d;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MetaItem = styled.span`
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardButton = styled(Link)`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3a56d4;
  }
`;

const TopicCard = ({ topic }) => {
  return (
    <Card>
      <CardImage image={topic.imageUrl} />
      <CardContent>
        <CardTitle>{topic.name}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
        
        <CardMeta>
          <MetaItem>
            <span role="img" aria-label="questions">❓</span> {topic.questionCount} questions
          </MetaItem>
          <MetaItem>
            <span role="img" aria-label="difficulty">🔥</span> {topic.difficulty}
          </MetaItem>
        </CardMeta>
        
        <CardButton to={`/quiz/${topic.id}`}>
          Start Quiz
        </CardButton>
      </CardContent>
    </Card>
  );
};

export default TopicCard;

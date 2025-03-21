
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import '../styles/responsive.css';

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-3px);
    }
  }
  
  @media (max-width: 576px) {
    border-radius: 8px;
    /* Mobile devices often show a tap effect, so we can reduce hover effects */
    &:hover {
      transform: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    /* Add active state for touch feedback */
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CardImage = styled.div`
  height: 160px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  ${Card}:hover &::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    height: 140px;
  }
  
  @media (max-width: 576px) {
    height: 120px;
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 576px) {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
`;

const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
    margin-bottom: 6px;
  }
`;

const CardDescription = styled.p`
  color: #6c757d;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    margin-bottom: 10px;
    
    /* Limit height and add ellipsis for very long descriptions on mobile */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

const MetaItem = styled.span`
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 5px;
  
  @media (max-width: 576px) {
    font-size: 0.75rem;
    gap: 3px;
  }
`;

const DifficultyBadge = styled.span`
  background-color: ${props => {
    switch(props.difficulty) {
      case 'easy': return '#d8f3dc';
      case 'medium': return '#ffdd00';
      case 'hard': return '#ef476f';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch(props.difficulty) {
      case 'easy': return '#2d6a4f';
      case 'medium': return '#664d00';
      case 'hard': return '#ffffff';
      default: return '#495057';
    }
  }};
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  
  @media (max-width: 576px) {
    padding: 2px 6px;
    font-size: 0.7rem;
    border-radius: 10px;
  }
`;

const CardActions = styled.div`
  margin-top: auto;
`;

const CardButton = styled(Link)`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-align: center;
  
  &:hover {
    background-color: #3a56d4;
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 576px) {
    padding: 10px 14px;
    font-size: 0.9rem;
    display: block;
    width: 100%;
    /* Increase touch target size on mobile */
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Helper function to capitalize first letter of a string
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TopicCard = ({ topic }) => {
  // Determine icon based on category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'mathematics': return '🧮';
      case 'science': return '🔬';
      case 'history': return '📜';
      case 'technology': return '💻';
      case 'language': return '📚';
      case 'geography': return '🌍';
      case 'arts': return '🎭';
      default: return '📋';
    }
  };

  return (
    <Card className="mobile-full-width">
      <CardImage image={topic.imageUrl}>
        <CategoryTag>
          {getCategoryIcon(topic.category)} {capitalize(topic.category)}
        </CategoryTag>
      </CardImage>
      <CardContent>
        <CardTitle>{topic.name}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
        
        <CardMeta>
          <MetaItem>
            <span role="img" aria-label="questions">❓</span> {topic.questionCount} questions
          </MetaItem>
          <DifficultyBadge difficulty={topic.difficulty}>
            {capitalize(topic.difficulty)}
          </DifficultyBadge>
        </CardMeta>
        
        <CardActions>
          <CardButton to={`/quiz/${topic.id}`} className="touch-friendly-spacing">
            Start Quiz
          </CardButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default TopicCard;

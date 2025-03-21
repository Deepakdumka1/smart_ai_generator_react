
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  
  @media (max-width: 768px) {
    padding: 50px 20px;
    min-height: 50vh;
  }
  
  @media (max-width: 480px) {
    padding: 40px 15px;
  }
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  margin-bottom: 20px;
  color: #4361ee;
  
  @media (max-width: 768px) {
    font-size: 5rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 4rem;
    margin-bottom: 10px;
  }
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 30px;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 25px;
    line-height: 1.5;
  }
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: #3a56d4;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.95rem;
    width: 80%;
    max-width: 200px;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
      <NotFoundText>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </NotFoundText>
      <HomeButton to="/">
        Return to Home
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;

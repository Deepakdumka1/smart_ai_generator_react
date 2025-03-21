import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  margin-bottom: 20px;
  color: #4361ee;
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  color: #343a40;
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3a56d4;
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

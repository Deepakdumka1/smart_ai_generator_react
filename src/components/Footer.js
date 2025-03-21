import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: #f8f9fa;
  padding: 20px 0;
  margin-top: auto;
  
  @media (max-width: 576px) {
    padding: 15px 0;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 576px) {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  a {
    color: #f8f9fa;
    transition: color 0.3s ease;
    font-size: 0.9rem;
    
    @media (max-width: 576px) {
      font-size: 0.8rem;
    }
    
    &:hover {
      color: #ffd60a;
    }
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent className="container">
        <Copyright>
          &copy; {currentYear} SmartQuiz Generator. All rights reserved.
        </Copyright>
        
        <FooterLinks>
          <a href="/about">About</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;

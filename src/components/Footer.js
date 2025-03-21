
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: #f8f9fa;
  padding: 20px 0;
  margin-top: auto;
  width: 100%;
  
  /* Safe area insets for notched devices */
  padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
  
  @media (max-width: 768px) {
    padding: 18px 0;
  }
  
  @media (max-width: 576px) {
    padding: 15px 0;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
    width: 100%;
    padding: 0 10px;
  }
`;

const FooterLinks = styled.nav`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    gap: 15px;
    width: 100%;
    padding: 5px 0;
  }
  
  a {
    color: #f8f9fa;
    transition: color 0.3s ease;
    font-size: 0.9rem;
    text-decoration: none;
    padding: 5px;
    border-radius: 4px;
    
    /* Improve touch targets on mobile */
    @media (max-width: 768px) {
      padding: 8px;
      font-size: 0.85rem;
    }
    
    @media (max-width: 576px) {
      font-size: 0.8rem;
      padding: 8px 10px;
      display: inline-block;
    }
    
    /* Touch-friendly hover state */
    @media (hover: hover) {
      &:hover {
        color: #ffd60a;
      }
    }
    
    /* Active state for touch devices */
    &:active {
      color: #ffd60a;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }
  
  @media (max-width: 576px) {
    gap: 20px;
    margin-top: 5px;
  }
`;

const SocialIcon = styled.a`
  color: #f8f9fa;
  font-size: 1.2rem;
  transition: color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    color: #ffd60a;
    transform: translateY(-2px);
  }
  
  @media (max-width: 576px) {
    font-size: 1.3rem; /* Slightly larger on mobile for better touch targets */
    padding: 5px;
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
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact</Link>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;

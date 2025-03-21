
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  text-align: center;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const Hero = styled.div`
  padding: 60px 20px;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  border-radius: 15px;
  color: white;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    margin-bottom: 30px;
    border-radius: 10px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
  
  span {
    color: #ffd60a;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 25px;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #ffd60a;
  color: #333;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: #ffea00;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    display: block;
    margin: 0 auto;
    max-width: 200px;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #4361ee;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 30px;
    
    &:after {
      width: 60px;
      height: 3px;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const HowItWorksSection = styled.section`
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const Step = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  text-align: left;
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const StepNumber = styled.div`
  background-color: #4361ee;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
`;

const StepDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const BottomCTA = styled(CTAButton)`
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>
          Smart<span>Quiz</span> Generator
        </HeroTitle>
        <HeroSubtitle>
          An AI-powered adaptive quiz system that personalizes questions based on your performance,
          helping you learn more efficiently and retain information better.
        </HeroSubtitle>
        <CTAButton to="/topics">
          Start Learning Now
        </CTAButton>
      </Hero>
      
      <FeaturesSection>
        <SectionTitle>Key Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>Adaptive Difficulty</FeatureTitle>
            <FeatureDescription>
              Questions automatically adjust in difficulty based on your performance, ensuring optimal learning.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Topic-Specific Analysis</FeatureTitle>
            <FeatureDescription>
              Detailed performance tracking across different subjects to identify your strengths and weaknesses.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Based Recommendations</FeatureTitle>
            <FeatureDescription>
              Receive personalized suggestions on which topics to focus on next to maximize your learning.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⏱️</FeatureIcon>
            <FeatureTitle>Time-Based Adjustments</FeatureTitle>
            <FeatureDescription>
              Response time is factored into the difficulty adjustment, providing a comprehensive assessment.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Start the Quiz</StepTitle>
              <StepDescription>
                Begin with medium-difficulty questions that establish your baseline knowledge level.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>Adaptive Questioning</StepTitle>
              <StepDescription>
                The system adjusts question difficulty based on your answers. Correct answers lead to harder questions, 
                while incorrect answers lead to easier ones.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>Progress Tracking</StepTitle>
              <StepDescription>
                Your response time, accuracy, and topic mastery are continuously tracked throughout the quiz.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>Performance Analysis</StepTitle>
              <StepDescription>
                Receive a detailed report at the end of each quiz, highlighting your strengths, weaknesses, 
                and recommendations for improvement.
              </StepDescription>
            </StepContent>
          </Step>
        </StepsContainer>
      </HowItWorksSection>
      
      <BottomCTA to="/topics">
        Explore Topics
      </BottomCTA>
    </HomeContainer>
  );
};

export default Home;

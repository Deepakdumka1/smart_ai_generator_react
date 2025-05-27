import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useChatBot } from '../context/ChatBotContext';
import { Link } from 'react-router-dom';
import { topicsData } from '../data/topicsData';
import { FaRobot, FaPaperPlane, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { analyzeMessage, getPersonalizedResponse, getSuggestedTopic, getRandomResponse } from '../utils/chatbotUtils';

// Styled components for the chatbot with responsive improvements
const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 350px;
  max-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(calc(100% - 60px))'};
  
  /* Responsive styling for mobile devices */
  @media (max-width: 768px) {
    width: 85%;
    max-width: 350px;
    right: 10px;
    bottom: 80px; /* Increased to prevent overlap with other fixed elements */
    max-height: 450px;
  }
  
  @media (max-width: 480px) {
    width: 90%;
    right: 5%;
    left: 5%;
    bottom: 70px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #4361ee;
  color: white;
  cursor: pointer;
  
  @media (max-width: 480px) {
    padding: 12px 15px;
  }
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const BotAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ffd60a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4361ee;
  
  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    
    svg {
      font-size: 0.9rem;
    }
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  max-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    padding: 12px;
    max-height: 300px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    max-height: 280px;
  }
  
  /* Improved scrollbar styling for mobile */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isBot ? `
    align-self: flex-start;
    background-color: #f1f3f5;
    color: #495057;
    border-bottom-left-radius: 5px;
  ` : `
    align-self: flex-end;
    background-color: #4361ee;
    color: white;
    border-bottom-right-radius: 5px;
  `}
  
  @media (max-width: 480px) {
    max-width: 85%;
    padding: 8px 12px;
    font-size: 0.85rem;
    line-height: 1.3;
  }
`;

const ChatFooter = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 8px;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #e9ecef;
  outline: none;
  font-size: 0.9rem;
  
  &:focus {
    border-color: #4361ee;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 16px; /* Prevent iOS zoom on input focus */
  }
`;

const SendButton = styled.button`
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3a56d4;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: 40px; /* Slightly larger for better touch target */
    height: 40px;
    min-width: 40px; /* Ensure minimum touch target size */
    min-height: 40px;
  }
`;

const QuizButton = styled.button`
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3a56d4;
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px; /* Increased padding for better touch target */
    font-size: 0.85rem;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  align-self: flex-start;
  
  span {
    width: 8px;
    height: 8px;
    background-color: #a0aec0;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite both;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes typing {
    0% {
      opacity: 0.4;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-5px);
    }
    100% {
      opacity: 0.4;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    
    span {
      width: 6px;
      height: 6px;
    }
  }
`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const { isChatBotVisible, toggleChatBot } = useChatBot();
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Initial greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = currentUser 
        ? `Hello ${currentUser.firstName || 'there'}! How can I help you today?` 
        : getRandomResponse('greetings')[Math.floor(Math.random() * getRandomResponse('greetings').length)];
      
      setIsTyping(true);
      
      // Simulate bot typing
      setTimeout(() => {
        setMessages([{ text: greeting, isBot: true }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, currentUser, messages.length]);
  
  // Update isOpen when isChatBotVisible changes
  useEffect(() => {
    setIsOpen(isChatBotVisible);
  }, [isChatBotVisible]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    toggleChatBot();
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage();
    }
  };
  
  const handleTakeQuiz = (topicId) => {
    // Placeholder for quiz taking
  };
  
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    setIsTyping(true);
    
    try {
      const responseCategory = analyzeMessage(userMessage.text);
      const botResponse = getPersonalizedResponse(responseCategory, currentUser);
      
      const botMessage = typeof botResponse === 'object'
        ? { ...botResponse, isBot: true }
        : { text: botResponse, isBot: true };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      // Fallback to a simple error message
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my AI services. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  if (!isChatBotVisible) {
    return null;
  }
  
  return (
    <ChatBotContainer isOpen={isOpen}>
      <ChatHeader onClick={toggleChat}>
        <ChatTitle>
          <BotAvatar><FaRobot /></BotAvatar>
          QuizBot Assistant
        </ChatTitle>
        <HeaderIcons>
          {isOpen && <FaTimes onClick={(e) => {
            e.stopPropagation();
            toggleChat();
          }} />}
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </HeaderIcons>
      </ChatHeader>
      
      {isOpen && (
        <>
          <ChatBody>
            {messages.map((message, index) => (
              <div key={index}>
                <Message isBot={message.isBot}>
                  {message.text}
                </Message>
                
                {message.showQuizButton && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                    marginTop: '5px'
                  }}>
                    <QuizButton onClick={() => handleTakeQuiz(message.topicId)}>
                      Take this Quiz
                    </QuizButton>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <TypingIndicator>
                <span></span>
                <span></span>
                <span></span>
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </ChatBody>
          
          <ChatFooter>
            <ChatInput 
              type="text" 
              placeholder="Type a message..." 
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <SendButton 
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <FaPaperPlane size={14} />
            </SendButton>
          </ChatFooter>
        </>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot;

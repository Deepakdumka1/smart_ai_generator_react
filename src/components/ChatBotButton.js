
import React from 'react';
import styled from 'styled-components';
import { useChatBot } from '../context/ChatBotContext';
import { FaComments } from 'react-icons/fa';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4361ee;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
  
  /* Safe area inset for iOS devices */
  padding-bottom: env(safe-area-inset-bottom, 0);
  right: max(20px, env(safe-area-inset-right, 20px));
  
  /* Responsive adjustments for mobile */
  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    bottom: 15px;
    right: 15px;
  }
  
  /* Smaller size for very small screens */
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    bottom: 12px;
    right: 12px;
    font-size: 1.3rem;
  }
  
  /* Ensure touch target size meets accessibility standards */
  @media (any-pointer: coarse) {
    min-width: 44px;
    min-height: 44px;
  }
  
  &:hover {
    background-color: #3a56d4;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Touch-specific active state */
  @media (hover: none) {
    &:active {
      background-color: #3a56d4;
      transform: scale(0.95);
    }
  }
  
  /* Add a small bounce animation when the chatbot is closed */
  &.attention {
    animation: bounce 1s ease infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const ChatBotButton = () => {
  const { toggleChatBot, isChatBotVisible } = useChatBot();
  
  return (
    <FloatingButton 
      onClick={toggleChatBot} 
      aria-label="Toggle Chat Bot"
      className={!isChatBotVisible ? 'attention' : ''}
    >
      <FaComments size={window.innerWidth <= 480 ? 20 : 24} />
    </FloatingButton>
  );
};

export default ChatBotButton;

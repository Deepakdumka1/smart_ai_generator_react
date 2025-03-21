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
  
  &:hover {
    background-color: #3a56d4;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ChatBotButton = () => {
  const { toggleChatBot } = useChatBot();
  
  return (
    <FloatingButton onClick={toggleChatBot} aria-label="Toggle Chat Bot">
      <FaComments size={24} />
    </FloatingButton>
  );
};

export default ChatBotButton;

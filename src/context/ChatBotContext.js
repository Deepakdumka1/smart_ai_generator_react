import React, { createContext, useState, useContext } from 'react';

// Create the chatbot context
export const ChatBotContext = createContext();

// Custom hook to use the chatbot context
export const useChatBot = () => useContext(ChatBotContext);

// Provider component
export const ChatBotProvider = ({ children }) => {
  const [isChatBotVisible, setIsChatBotVisible] = useState(true);
  
  // Toggle chatbot visibility
  const toggleChatBot = () => {
    setIsChatBotVisible(prev => !prev);
  };
  
  // Show chatbot
  const showChatBot = () => {
    setIsChatBotVisible(true);
  };
  
  // Hide chatbot
  const hideChatBot = () => {
    setIsChatBotVisible(false);
  };
  
  const value = {
    isChatBotVisible,
    toggleChatBot,
    showChatBot,
    hideChatBot
  };
  
  return (
    <ChatBotContext.Provider value={value}>
      {children}
    </ChatBotContext.Provider>
  );
};

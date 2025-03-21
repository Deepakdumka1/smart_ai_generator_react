import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useChatBot } from '../context/ChatBotContext';
import { useNavigate } from 'react-router-dom';
import { topicsData } from '../data/topicsData';
import { FaRobot, FaPaperPlane, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Styled components for the chatbot
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
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #4361ee;
  color: white;
  cursor: pointer;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
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
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  max-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  line-height: 1.4;
  
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
`;

const ChatFooter = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
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
`;

// Bot responses
const botResponses = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! I'm QuizBot. What can I do for you?",
    "Hey! Need help with a quiz or just want to chat?",
    "Welcome! I'm here to assist you with your quiz journey."
  ],
  
  farewell: [
    "Goodbye! Come back anytime.",
    "See you later! Hope you enjoyed our chat.",
    "Bye! Good luck with your quizzes!",
    "Take care! Feel free to chat again when you're back."
  ],
  
  quiz: [
    "Our quizzes are designed to adapt to your knowledge level. The more you answer correctly, the harder they get!",
    "Did you know? You can track your quiz history in your profile page.",
    "Try different topics to expand your knowledge base!",
    "If you're finding quizzes too difficult, don't worry! Practice makes perfect."
  ],
  
  help: [
    "You can browse topics from the Topics page, take quizzes, and track your progress in your profile.",
    "Need help with a specific feature? Just ask me!",
    "If you're looking for study resources, I can suggest some based on your quiz history.",
    "Don't forget to update your profile with a photo to personalize your experience!"
  ],
  
  unknown: [
    "I'm not sure I understand. Could you rephrase that?",
    "Hmm, I'm still learning. Can you try asking in a different way?",
    "I didn't quite catch that. What would you like to know about?",
    "I'm sorry, I don't have information on that yet. Is there something else I can help with?"
  ],
  
  joke: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call a fake noodle? An impasta!"
  ],
  
  motivation: [
    "You're doing great! Keep pushing forward with your learning journey.",
    "Remember, every expert was once a beginner. Keep practicing!",
    "The more you learn, the more you grow. You're on the right path!",
    "Success comes from persistence. Keep taking those quizzes!"
  ],
  
  suggestion: [
    "Based on your quiz history, I think you might enjoy trying a quiz on {topic}.",
    "Have you considered taking a quiz on {topic}? It might be interesting for you!",
    "Looking for a new challenge? Why not try a quiz on {topic}?",
    "I noticed you haven't tried {topic} yet. Would you like to give it a go?"
  ],
  
  bored: [
    "Feeling bored? Let me suggest a quiz to keep your mind active!",
    "Boredom is the perfect opportunity to learn something new. How about a quiz?",
    "I can help cure your boredom! Would you like a quiz suggestion or maybe a joke?",
    "When you're bored, it's the perfect time to challenge yourself with a new quiz topic!"
  ],
  
  profile: [
    "You can update your profile information and photo in the profile page.",
    "Your quiz history is saved in your profile. It's a great way to track your progress!",
    "Don't forget to complete your profile information to personalize your experience.",
    "Your profile helps us provide better quiz recommendations based on your interests and performance."
  ]
};

// Function to get a random response from a category
const getRandomResponse = (category) => {
  const responses = botResponses[category] || botResponses.unknown;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Function to analyze user message and determine response category
const analyzeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (/^(hi|hello|hey|greetings|howdy|hola)/i.test(lowerMessage)) {
    return 'greetings';
  }
  
  // Check for farewell
  if (/^(bye|goodbye|see you|farewell|later)/i.test(lowerMessage)) {
    return 'farewell';
  }
  
  // Check for quiz related questions
  if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('question') || lowerMessage.includes('answer')) {
    return 'quiz';
  }
  
  // Check for help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('how do i') || lowerMessage.includes('how to') || lowerMessage.includes('what is') || lowerMessage.includes('guide')) {
    return 'help';
  }
  
  // Check for joke requests
  if (lowerMessage.includes('joke') || lowerMessage.includes('funny') || lowerMessage.includes('laugh') || lowerMessage.includes('humor')) {
    return 'joke';
  }
  
  // Check for motivation requests
  if (lowerMessage.includes('motivate') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
    return 'motivation';
  }
  
  // Check for boredom
  if (lowerMessage.includes('bored') || lowerMessage.includes('boring') || lowerMessage.includes('nothing to do') || lowerMessage.includes('tired')) {
    return 'bored';
  }
  
  // Check for profile related questions
  if (lowerMessage.includes('profile') || lowerMessage.includes('account') || lowerMessage.includes('my info') || lowerMessage.includes('my information')) {
    return 'profile';
  }
  
  // Check for suggestion requests
  if (lowerMessage.includes('suggest') || lowerMessage.includes('recommendation') || lowerMessage.includes('recommend') || lowerMessage.includes('what should i')) {
    return 'suggestion';
  }
  
  // Default to unknown
  return 'unknown';
};

// Function to get a personalized response
const getPersonalizedResponse = (category, currentUser) => {
  // Get random response from category
  const responses = botResponses[category] || botResponses.unknown;
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Personalize with user data if available
  if (currentUser) {
    // Replace placeholders with user data
    response = response.replace('{name}', currentUser.firstName || 'there');
    
    // For suggestions, recommend a topic based on user history
    if (category === 'suggestion' || category === 'bored') {
      // Get a random topic that the user hasn't tried yet or has performed poorly on
      const suggestedTopic = getSuggestedTopic(currentUser);
      response = response.replace('{topic}', suggestedTopic.name);
      
      // Add a button to take the quiz
      response = {
        text: response,
        topicId: suggestedTopic.id,
        showQuizButton: true
      };
    }
  }
  
  return response;
};

// Function to get a suggested topic based on user history
const getSuggestedTopic = (currentUser) => {
  // If user has no history, suggest a random topic
  if (!currentUser || !currentUser.quizHistory || currentUser.quizHistory.length === 0) {
    return topicsData[Math.floor(Math.random() * topicsData.length)];
  }
  
  // Get topics the user has already tried
  const triedTopicIds = currentUser.quizHistory.map(quiz => quiz.topicId);
  
  // Find topics the user hasn't tried yet
  const untried = topicsData.filter(topic => !triedTopicIds.includes(topic.id));
  
  // If there are untried topics, suggest one of those
  if (untried.length > 0) {
    return untried[Math.floor(Math.random() * untried.length)];
  }
  
  // Otherwise, suggest a topic the user has performed poorly on
  const topicPerformance = {};
  
  // Calculate average score for each topic
  currentUser.quizHistory.forEach(quiz => {
    const correctAnswers = quiz.answers.filter(a => a.correct).length;
    const score = correctAnswers / quiz.totalQuestions;
    
    if (!topicPerformance[quiz.topicId]) {
      topicPerformance[quiz.topicId] = {
        totalScore: 0,
        count: 0
      };
    }
    
    topicPerformance[quiz.topicId].totalScore += score;
    topicPerformance[quiz.topicId].count += 1;
  });
  
  // Convert to array of objects with average score
  const topicScores = Object.keys(topicPerformance).map(topicId => ({
    topicId,
    averageScore: topicPerformance[topicId].totalScore / topicPerformance[topicId].count
  }));
  
  // Sort by average score (ascending)
  topicScores.sort((a, b) => a.averageScore - b.averageScore);
  
  // Get the topic with the lowest score
  const lowestScoreTopic = topicsData.find(topic => topic.id === topicScores[0].topicId);
  
  return lowestScoreTopic || topicsData[Math.floor(Math.random() * topicsData.length)];
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const { isChatBotVisible, toggleChatBot } = useChatBot();
  const navigate = useNavigate();
  
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
        ? `Hello ${currentUser.firstName}! How can I help you today?` 
        : botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
      
      setIsTyping(true);
      
      // Simulate bot typing
      setTimeout(() => {
        setMessages([{ text: greeting, isBot: true }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, currentUser]);
  
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
    navigate(`/quiz/${topicId}`);
    toggleChat(); // Close the chat
  };
  
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Analyze message and get response category
    const responseCategory = analyzeMessage(userMessage.text);
    
    // Simulate response delay
    setTimeout(() => {
      const botResponse = getPersonalizedResponse(responseCategory, currentUser);
      
      // Check if response is an object with additional properties
      const botMessage = typeof botResponse === 'object'
        ? { ...botResponse, isBot: true }
        : { text: botResponse, isBot: true };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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

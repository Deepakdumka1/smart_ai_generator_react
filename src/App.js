import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ChatBot from './components/ChatBot';
import ChatBotButton from './components/ChatBotButton';

// Pages
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Topics from './pages/Topics';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Context
import { AuthProvider } from './context/AuthContext';
import { ChatBotProvider } from './context/ChatBotContext';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 30px 0;
  
  @media (max-width: 768px) {
    padding: 20px 0;
  }
  
  @media (max-width: 576px) {
    padding: 15px 0;
  }
`;

function App() {
  return (
    <AuthProvider>
      <ChatBotProvider>
        <Router>
          <AppContainer>
            <Header />
            <MainContent className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/quiz/:topicId" element={
                  <PrivateRoute>
                    <Quiz />
                  </PrivateRoute>
                } />
                <Route path="/results/:quizId" element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainContent>
            <Footer />
            <ChatBot />
            <ChatBotButton />
          </AppContainer>
        </Router>
      </ChatBotProvider>
    </AuthProvider>
  );
}

export default App;

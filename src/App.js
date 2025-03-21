
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ChatBot from './components/ChatBot';
import ChatBotButton from './components/ChatBotButton';
import ProgressBar from './components/ProgressBar'; // For page loading animation

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

// Import responsive utility classes
import './styles/responsive.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  
  /* Add smooth font rendering for all text */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Ensure proper spacing for devices with notches or system bars */
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-top: env(safe-area-inset-top, 0);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 30px 0;
  width: 100%;
  
  /* Responsive padding adjustments */
  @media (max-width: 768px) {
    padding: 20px 0;
  }
  
  @media (max-width: 576px) {
    padding: 15px 0;
  }
  
  /* Smooth transition for content changes */
  transition: padding 0.3s ease;
`;

const SkipToContent = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  background: #4361ee;
  color: white;
  padding: 10px;
  text-align: center;
  z-index: 1001;
  transition: top 0.3s ease;
  
  &:focus {
    top: 0;
  }
`;

function App() {
  // Handle page transitions and loading states
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Listen for route changes to show loading bar
  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true);
      // Reset scroll position on page change
      window.scrollTo(0, 0);
      
      // Simulate a small delay for the loading indicator
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    
    // Clean up listeners
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // Handle viewport height for mobile browsers
  useEffect(() => {
    // Fix for mobile viewport height issues with address bar
    const setVhProperty = () => {
      // Set the --vh custom property to the actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial value
    setVhProperty();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);
    
    return () => {
      window.removeEventListener('resize', setVhProperty);
      window.removeEventListener('orientationchange', setVhProperty);
    };
  }, []);
  
  return (
    <AuthProvider>
      <ChatBotProvider>
        <Router>
          <AppContainer className="overflow-hidden position-relative">
            {/* Accessibility: Skip to content link */}
            <SkipToContent href="#main-content">
              Skip to main content
            </SkipToContent>
            
            {/* Loading progress indicator */}
            {isLoading && <ProgressBar />}
            
            <Header />
            
            <MainContent id="main-content" className="container">
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
            
            {/* ChatBot components */}
            <ChatBot />
            <ChatBotButton />
          </AppContainer>
        </Router>
      </ChatBotProvider>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './Topics.css';
import styled from 'styled-components';
import TopicCard from '../components/TopicCard';
import { topicsData } from '../data/topicsData';
import '../styles/responsive.css';

const TopicsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 576px) {
    padding: 10px;
  }
`;

const TopicsHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const TopicsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
`;

const TopicsDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
  
  @media (max-width: 576px) {
    gap: 8px;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#4361ee' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3a56d4' : '#dee2e6'};
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding: 8px 12px;
    flex: 1 0 auto;
    text-align: center;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FiltersWrapper = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

const FilterLabel = styled.div`
  font-weight: 500;
  margin-right: 10px;
  color: #495057;
  
  @media (max-width: 576px) {
    margin-bottom: 5px;
    margin-right: 0;
    width: 100%;
    text-align: center;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  width: 250px;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-height: 44px;
    font-size: 16px;
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const NoTopicsFound = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #6c757d;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    padding: 30px;
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    padding: 20px;
    font-size: 0.9rem;
  }
`;

const CategoryFiltersContainer = styled.div`
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const ScrollableFilterGroup = styled(FilterGroup)`
  flex-wrap: nowrap;
  padding-bottom: 5px;
  
  @media (max-width: 576px) {
    justify-content: flex-start;
  }
`;

const Topics = () => {
  const { currentUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [debugInfo, setDebugInfo] = useState('');

  // Handle window resize to detect screen size changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTopicsFromFirebase();
  }, []);

  const fetchTopicsFromFirebase = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Starting to fetch topics...');
      
      console.log('🔍 Fetching topics from Firebase...');
      
      // First, let's check if we can connect to Firebase at all
      try {
        const testCollection = collection(db, 'topics');
        console.log('✅ Firebase connection successful');
        setDebugInfo('Firebase connection successful. Fetching topics...');
      } catch (connectionError) {
        console.error('❌ Firebase connection failed:', connectionError);
        setError('Failed to connect to Firebase. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Fetch all documents from topics collection
      const topicsSnapshot = await getDocs(collection(db, 'topics'));
      console.log('📊 Topics collection query result:', {
        empty: topicsSnapshot.empty,
        size: topicsSnapshot.size,
        docs: topicsSnapshot.docs.length
      });

      setDebugInfo(`Found ${topicsSnapshot.size} documents in topics collection`);

      if (topicsSnapshot.empty) {
        console.log('⚠️ No topics found in Firebase');
        setError('No topics found in the database. Please run the migration first from the Admin Panel.');
        setDebugInfo('Topics collection is empty. Migration needed.');
        setLoading(false);
        return;
      }

      // Log the first topic to see its structure
      const firstDoc = topicsSnapshot.docs[0];
      console.log('📋 First topic document structure:', {
        id: firstDoc.id,
        data: firstDoc.data()
      });

      // Process topics and get question counts
      const topicsWithCounts = await Promise.all(
        topicsSnapshot.docs.map(async (topicDoc) => {
          const topicData = topicDoc.data();
          const topicWithId = { 
            firebaseId: topicDoc.id, 
            ...topicData 
          };
          
          console.log('🏷️ Processing topic:', {
            firebaseId: topicDoc.id,
            topicId: topicData.id,
            name: topicData.name
          });

          try {
            // Get question count for this topic
            let questionsQuery;
            if (topicData.id) {
              questionsQuery = query(
                collection(db, 'questions'),
                where('topicId', '==', topicData.id)
              );
            } else {
              // Fallback: use Firebase document ID
              questionsQuery = query(
                collection(db, 'questions'),
                where('topicId', '==', topicDoc.id)
              );
            }
            
            const questionsSnapshot = await getDocs(questionsQuery);
            const questionCount = questionsSnapshot.size;
            
            console.log(`📝 Questions for topic ${topicData.name}:`, {
              count: questionCount,
              topicId: topicData.id || topicDoc.id
            });

            // Get difficulty distribution
            const difficulties = { easy: 0, medium: 0, hard: 0 };
            questionsSnapshot.docs.forEach(doc => {
              const questionData = doc.data();
              const difficulty = questionData.difficulty || 'medium';
              if (difficulties.hasOwnProperty(difficulty.toLowerCase())) {
                difficulties[difficulty.toLowerCase()]++;
              }
            });

            return {
              ...topicWithId,
              questionCount,
              difficulties,
              // Ensure required fields with fallbacks
              id: topicData.id || topicDoc.id,
              name: topicData.name || 'Unnamed Topic',
              description: topicData.description || `Learn about ${topicData.name || 'this topic'}`,
              icon: topicData.icon || '📚',
              color: topicData.color || '#4361ee'
            };
          } catch (questionError) {
            console.error('❌ Error fetching questions for topic:', topicData.name, questionError);
            // Return topic with zero questions if there's an error
            return {
              ...topicWithId,
              questionCount: 0,
              difficulties: { easy: 0, medium: 0, hard: 0 },
              id: topicData.id || topicDoc.id,
              name: topicData.name || 'Unnamed Topic',
              description: topicData.description || `Learn about ${topicData.name || 'this topic'}`,
              icon: topicData.icon || '📚',
              color: topicData.color || '#4361ee'
            };
          }
        })
      );

      console.log('✅ Final topics with question counts:', topicsWithCounts);
      setTopics(topicsWithCounts);
      setDebugInfo(`Successfully loaded ${topicsWithCounts.length} topics`);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
      setError(`Failed to load topics: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  // Filter topics based on search and difficulty
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             topic.difficulties[selectedDifficulty] > 0;
    
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="topics-container">
        <div className="topics-header">
          <h1>Quiz Topics</h1>
          <p>Loading topics from database...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching topics...</p>
          {debugInfo && (
            <div className="debug-info">
              <small>{debugInfo}</small>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topics-container">
        <div className="topics-header">
          <h1>Quiz Topics</h1>
        </div>
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Topics</h3>
          <p>{error}</p>
          
          {/* Debug Information */}
          <div className="debug-section">
            <details>
              <summary>Debug Information (Click to expand)</summary>
              <div className="debug-details">
                <p><strong>Debug Info:</strong> {debugInfo}</p>
                <p><strong>Current User:</strong> {currentUser ? currentUser.email : 'Not logged in'}</p>
                <p><strong>Firebase Config:</strong> {db ? 'Connected' : 'Not connected'}</p>
                <p><strong>Collections to check:</strong></p>
                <ul>
                  <li>topics - Should contain topic documents</li>
                  <li>questions - Should contain question documents with topicId field</li>
                </ul>
              </div>
            </details>
          </div>

          <div className="error-actions">
            <button onClick={fetchTopicsFromFirebase} className="retry-btn">
              Try Again
            </button>
            {currentUser && (currentUser.isAdmin || currentUser.email === 'admin@quiz.com') && (
              <div className="admin-help">
                <p>As an admin, you can:</p>
                <Link to="/admin" className="admin-link">
                  Go to Admin Panel to run migration
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topics-container">
      <div className="topics-header">
        <h1>Quiz Topics</h1>
        <p>Choose a topic to start your quiz journey</p>
        
        {/* Debug Info */}
        <div className="debug-info">
          <small>
            Loaded {topics.length} topics from Firebase | 
            Showing {filteredTopics.length} after filters |
            {debugInfo}
          </small>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="topics-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="difficulty-filter">
          <label>Filter by difficulty:</label>
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="difficulty-select"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="topics-grid">
          {filteredTopics.map((topic) => (
            <div key={topic.firebaseId} className="topic-card">
              <div 
                className="topic-header"
                style={{ backgroundColor: topic.color }}
              >
                <div className="topic-icon">{topic.icon}</div>
                <h3>{topic.name}</h3>
              </div>
              
              <div className="topic-content">
                <p className="topic-description">{topic.description}</p>
                
                <div className="topic-stats">
                  <div className="stat">
                    <span className="stat-number">{topic.questionCount}</span>
                    <span className="stat-label">Questions</span>
                  </div>
                  
                  <div className="difficulty-breakdown">
                    <div className="difficulty-item">
                      <span className="difficulty-dot easy"></span>
                      <span>{topic.difficulties.easy} Easy</span>
                    </div>
                    <div className="difficulty-item">
                      <span className="difficulty-dot medium"></span>
                      <span>{topic.difficulties.medium} Medium</span>
                    </div>
                    <div className="difficulty-item">
                      <span className="difficulty-dot hard"></span>
                      <span>{topic.difficulties.hard} Hard</span>
                    </div>
                  </div>
                </div>

                {/* Debug info for each topic */}
                <div className="topic-debug">
                  <small>ID: {topic.id} | Firebase ID: {topic.firebaseId}</small>
                </div>
              </div>
              
              <div className="topic-actions">
                {topic.questionCount > 0 ? (
                  <Link 
                    to={`/quiz/${topic.id}`} 
                    className="start-quiz-btn"
                    style={{ backgroundColor: topic.color }}
                  >
                    Start Quiz
                  </Link>
                ) : (
                  <button className="start-quiz-btn disabled" disabled>
                    No Questions Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-topics">
          <div className="no-topics-icon">📚</div>
          <h3>No Topics Found</h3>
          <p>
            {searchTerm || selectedDifficulty !== 'all' 
              ? 'No topics match your current filters.' 
              : 'No topics available yet.'}
          </p>
          {(searchTerm || selectedDifficulty !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Refresh Button */}
      <div className="topics-footer">
        <button onClick={fetchTopicsFromFirebase} className="refresh-btn">
          🔄 Refresh Topics
        </button>
      </div>
    </div>
  );
};

export default Topics;
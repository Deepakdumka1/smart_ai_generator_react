import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { createSampleData, testDatabaseAccess, loadUserQuizHistory } from '../utils/QuizResultHandler';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [creatingData, setCreatingData] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    if (currentUser) {
      console.log('👤 Profile loaded for user:', currentUser.email, currentUser.uid);
      loadUserData();
    } else {
      console.log('❌ No current user found');
      setDebugInfo('No current user found');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Starting to load user data...');
      setLastRefresh(new Date().toLocaleTimeString());
      
      console.log('🔄 Loading user data...');
      
      await Promise.all([
        loadQuizHistory(),
        loadUserStats(),
        loadTopics()
      ]);
      
      console.log('✅ User data loading completed');
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      setError(`Error loading user data: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizHistory = async () => {
    try {
      console.log('📚 Loading quiz history for user:', currentUser.uid);
      setDebugInfo('Loading quiz history...');
      
      // Method 1: Try using the utility function first
      try {
        console.log('🔍 Trying utility function method...');
        const utilityResult = await loadUserQuizHistory(currentUser);
        
        if (utilityResult.success && utilityResult.history.length > 0) {
          console.log('✅ Utility function successful:', utilityResult.count, 'items');
          setQuizHistory(utilityResult.history);
          setDebugInfo(`Successfully loaded ${utilityResult.count} quiz attempts via utility function`);
          return;
        } else {
          console.log('⚠️ Utility function returned no data');
        }
      } catch (utilityError) {
        console.log('⚠️ Utility function failed:', utilityError.message);
      }

      // Method 2: Direct Firestore query
      console.log('🔍 Trying direct Firestore query...');
      
      // First, check total documents in collection
      const allQuizHistorySnapshot = await getDocs(collection(db, 'quizHistory'));
      console.log('📊 Total documents in quizHistory collection:', allQuizHistorySnapshot.size);
      
      if (allQuizHistorySnapshot.empty) {
        console.log('⚠️ No documents found in quizHistory collection');
        setDebugInfo('No quiz history documents found in database. Try taking a quiz first!');
        setQuizHistory([]);
        return;
      }

      // Log sample documents for debugging
      console.log('📋 Sample quiz history documents:');
      allQuizHistorySnapshot.docs.slice(0, 5).forEach((doc, index) => {
        const data = doc.data();
        console.log(`Document ${index + 1}:`, {
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          topicName: data.topicName,
          percentage: data.percentage,
          completedAt: data.completedAt,
          createdAt: data.createdAt
        });
      });

      // Check for current user's documents
      const userDocuments = allQuizHistorySnapshot.docs.filter(doc => {
        const data = doc.data();
        return data.userId === currentUser.uid;
      });
      
      console.log('👤 Documents for current user:', userDocuments.length);
      console.log('🔍 Current user ID:', currentUser.uid);
      console.log('📧 Current user email:', currentUser.email);

      if (userDocuments.length === 0) {
        console.log('⚠️ No quiz history found for current user');
        
        // Check if there are documents with the user's email instead of UID
        const emailDocuments = allQuizHistorySnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.userEmail === currentUser.email;
        });
        
        if (emailDocuments.length > 0) {
          console.log('📧 Found documents by email:', emailDocuments.length);
          const history = emailDocuments.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setQuizHistory(history);
          setDebugInfo(`Found ${history.length} quiz attempts by email match`);
          return;
        }
        
        setDebugInfo(`No quiz history found for user ${currentUser.email}. Take a quiz to see results here!`);
        setQuizHistory([]);
        return;
      }

      // Convert user documents to history array
      const history = userDocuments.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by completion date
      history.sort((a, b) => {
        const aDate = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
        const bDate = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
        return bDate - aDate;
      });

      console.log('✅ Quiz history loaded successfully:', history.length, 'items');
      console.log('📋 First quiz item:', history[0]);
      
      setQuizHistory(history);
      setDebugInfo(`Successfully loaded ${history.length} quiz attempts`);
      
    } catch (error) {
      console.error('❌ Error loading quiz history:', error);
      setDebugInfo(`Error loading quiz history: ${error.message}`);
      
      if (error.code === 'permission-denied') {
        setError('Permission denied. Please check your login status.');
      } else if (error.message.includes('index')) {
        setError('Database index required. Please contact administrator.');
      } else {
        setError(`Failed to load quiz history: ${error.message}`);
      }
    }
  };

  const loadUserStats = async () => {
    try {
      console.log('📈 Loading user stats...');
      
      const userStatsRef = doc(db, 'userStats', currentUser.uid);
      const userStatsDoc = await getDoc(userStatsRef);
      
      if (userStatsDoc.exists()) {
        const statsData = userStatsDoc.data();
        console.log('📈 User stats loaded:', statsData);
        setUserStats(statsData);
      } else {
        console.log('⚠️ No user stats found');
        setUserStats(null);
      }
    } catch (error) {
      console.error('❌ Error loading user stats:', error);
    }
  };

  const loadTopics = async () => {
    try {
      console.log('🏷️ Loading topics...');
      
      const topicsSnapshot = await getDocs(collection(db, 'topics'));
      const topicsData = topicsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Topics loaded:', topicsData.length, 'topics');
      setTopics(topicsData);
    } catch (error) {
      console.error('❌ Error loading topics:', error);
    }
  };

  // Create sample quiz history for testing
  const createSampleQuizHistory = async () => {
    try {
      setCreatingData(true);
      setDebugInfo('Creating sample quiz history...');
      
      if (topics.length === 0) {
        setError('No topics available. Please add topics first.');
        return;
      }

      // Use the first available topic
      const sampleTopic = topics[0];
      
      console.log('🎯 Creating sample data for topic:', sampleTopic);
      
      const result = await createSampleData(currentUser, sampleTopic.id, sampleTopic.name);
      
      console.log('✅ Sample data creation result:', result);
      setDebugInfo('Sample quiz history created successfully!');
      
      // Wait a moment for data to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload data to show the new quiz history
      await loadUserData();
      
    } catch (error) {
      console.error('❌ Error creating sample data:', error);
      setError(`Error creating sample data: ${error.message}`);
      setDebugInfo(`Error creating sample data: ${error.message}`);
    } finally {
      setCreatingData(false);
    }
  };

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      console.log('🧪 Testing database connection...');
      setDebugInfo('Testing database connection...');
      
      const testResult = await testDatabaseAccess(currentUser);
      
      console.log('🧪 Database test result:', testResult);
      
      if (testResult.success) {
        setDebugInfo(`Database test successful: ${testResult.totalDocuments} total documents, ${testResult.userDocuments} user documents`);
      } else {
        setDebugInfo(`Database test failed: ${testResult.message}`);
        setError(testResult.message);
      }
      
    } catch (error) {
      console.error('❌ Error testing database connection:', error);
      setError(`Error testing database connection: ${error.message}`);
      setDebugInfo(`Error testing database connection: ${error.message}`);
    }
  };
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setDebugInfo('Logging out...');
      
      await logout();
      console.log('✅ User logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      setError(`Error logging out: ${error.message}`);
      setDebugInfo(`Logout error: ${error.message}`);
    } finally {
      setLoggingOut(false);
    }
  };

  // Force refresh function
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing data...');
    setQuizHistory([]); // Clear current data
    setUserStats(null);
    setError(null);
    await loadUserData();
  };

  const getFilteredAndSortedHistory = () => {
    let filtered = [...quizHistory];

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(quiz => quiz.topicId === selectedTopic);
    }

    switch (filter) {
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(quiz => {
          const completedAt = quiz.completedAt?.toDate ? quiz.completedAt.toDate() : new Date(quiz.completedAt);
          return completedAt > oneWeekAgo;
        });
        break;
      case 'best':
        filtered = filtered.filter(quiz => quiz.percentage >= 80);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'score':
        filtered.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
        break;
      case 'topic':
        filtered.sort((a, b) => (a.topicName || '').localeCompare(b.topicName || ''));
        break;
      default:
        filtered.sort((a, b) => {
          const aDate = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
          const bDate = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
          return bDate - aDate;
        });
        break;
    }

    return filtered;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getTopicInfo = (topicId) => {
    return topics.find(topic => topic.id === topicId) || { 
      name: 'Unknown Topic', 
      color: '#6c757d', 
      icon: '📝' 
    };
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
          {debugInfo && (
            <div className="debug-info">
              <small>{debugInfo}</small>
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredHistory = getFilteredAndSortedHistory();

  return (
    <div className="profile-container">
      {/* Debug Section */}
      <div className="debug-section">
        <details>
          <summary>🔧 Debug Information & Tools (Click to expand)</summary>
          <div className="debug-content">
            <p><strong>Current User:</strong> {currentUser?.email} (ID: {currentUser?.uid})</p>
            <p><strong>Quiz History Count:</strong> {quizHistory.length}</p>
            <p><strong>Topics Count:</strong> {topics.length}</p>
            <p><strong>User Stats:</strong> {userStats ? 'Loaded' : 'Not found'}</p>
            <p><strong>Last Refresh:</strong> {lastRefresh || 'Never'}</p>
            <p><strong>Debug Info:</strong> {debugInfo}</p>
            {error && <p style={{color: 'red'}}><strong>Error:</strong> {error}</p>}
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={testDatabaseConnection} className="debug-btn">
                🧪 Test Database
              </button>
              
              <button onClick={forceRefresh} className="debug-btn" disabled={loading}>
                🔄 Force Refresh
              </button>
              
              <button 
                onClick={createSampleQuizHistory} 
                className="debug-btn"
                disabled={creatingData || topics.length === 0}
              >
                {creatingData ? '⏳ Creating...' : '🎯 Create Sample Data'}
              </button>
              
              <button 
                onClick={() => {
                  console.log('Current quiz history:', quizHistory);
                  console.log('Current user stats:', userStats);
                  console.log('Current topics:', topics);
                }} 
                className="debug-btn"
              >
                📋 Log Current Data
              </button>
            </div>
            
            {quizHistory.length > 0 && (
              <div className="debug-data">
                <h4>Sample Quiz History Data:</h4>
                <pre>{JSON.stringify(quizHistory[0], null, 2)}</pre>
              </div>
            )}
          </div>
        </details>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                 currentUser.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-details">
            <h1>{currentUser.displayName || 'Quiz Enthusiast'}</h1>
            <p className="user-email">{currentUser.email}</p>
            <p className="member-since">
              Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <div className="spinner small"></div>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <span className="logout-icon">🚪</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Statistics */}
      {userStats && (
        <div className="stats-section">
          <h2>Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{userStats.totalQuizzes || 0}</div>
              <div className="stat-label">Quizzes Taken</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{Math.round(userStats.averageScore || 0)}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{formatTime(userStats.totalTimeSpent || 0)}</div>
              <div className="stat-label">Total Time</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{userStats.totalCorrectAnswers || 0}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History Section */}
      <div className="history-section">
        <div className="history-header">
          <h2>Quiz History</h2>
          <div className="history-controls">
            <div className="filter-group">
              <label>Filter:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Quizzes</option>
                <option value="recent">Recent (7 days)</option>
                <option value="best">Best Scores (80%+)</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Topic:</label>
              <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="score">Score</option>
                <option value="topic">Topic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz History List */}
        {filteredHistory.length === 0 ? (
          <div className="no-history">
            <div className="no-history-icon">📚</div>
            <h3>No Quiz History Found</h3>
            <p>
              {quizHistory.length === 0 
                ? "You haven't taken any quizzes yet. Start your learning journey!"
                : "No quizzes match your current filters. Try adjusting your search criteria."
              }
            </p>
            {quizHistory.length === 0 && (
              <div className="no-history-actions">
                <Link to="/topics" className="start-quiz-btn">
                  🚀 Take Your First Quiz
                </Link>
                {topics.length > 0 && (
                  <button 
                    onClick={createSampleQuizHistory} 
                    className="sample-data-btn"
                    disabled={creatingData}
                  >
                    {creatingData ? '⏳ Creating...' : '🎯 Create Sample Data'}
                  </button>
                )}
              </div>
            )}
            
            {/* Troubleshooting Tips */}
            <div className="troubleshooting">
              <h4>🔧 Troubleshooting Tips:</h4>
              <ul>
                <li>Make sure you've completed at least one quiz</li>
                <li>Check that you're logged in with the same account</li>
                <li>Try the "Force Refresh" button in the debug section</li>
                <li>Check the debug information above for detailed logs</li>
                <li>If problems persist, try creating sample data for testing</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((quiz, index) => {
              const topicInfo = getTopicInfo(quiz.topicId);
              const scoreColor = getScoreColor(quiz.percentage || 0);
              
              return (
                <div key={quiz.id || index} className="history-item">
                  <div className="history-item-header">
                    <div className="topic-info">
                      <span className="topic-icon">{topicInfo.icon || '📝'}</span>
                      <div className="topic-details">
                        <h4 className="topic-name">{quiz.topicName || topicInfo.name}</h4>
                        <span className="topic-badge" style={{ backgroundColor: topicInfo.color || '#6c757d' }}>
                          {quiz.difficulty || 'Mixed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="quiz-score">
                      <div 
                        className="score-circle" 
                        style={{ borderColor: scoreColor, color: scoreColor }}
                      >
                        <span className="score-percentage">{quiz.percentage || 0}%</span>
                        <span className="score-fraction">
                          {quiz.correctAnswers || 0}/{quiz.totalQuestions || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="history-item-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {formatDate(quiz.completedAt)}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span className="detail-text">
                        {formatTime(quiz.timeSpent)}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-icon">✅</span>
                      <span className="detail-text">
                        {quiz.correctAnswers || 0} correct
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-icon">❌</span>
                      <span className="detail-text">
                        {quiz.incorrectAnswers || ((quiz.totalQuestions || 0) - (quiz.correctAnswers || 0))} incorrect
                      </span>
                    </div>
                  </div>
                  
                  <div className="quiz-actions">
                    <Link 
                      to={`/results/${quiz.id}`} 
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/quiz/${quiz.topicId}`} 
                      className="btn btn-sm btn-secondary"
                    >
                      Retake Quiz
                    </Link>
                  </div>
                  
                  {quiz.percentage >= 80 && (
                    <div className="achievement-badge">
                      🏆 Great Score!
                    </div>
                  )}
                  
                  {quiz.percentage === 100 && (
                    <div className="achievement-badge perfect">
                      🎯 Perfect Score!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/topics" className="action-btn primary">
            <span className="action-icon">🎯</span>
            <span>Take New Quiz</span>
          </Link>
          
          <button onClick={forceRefresh} className="action-btn secondary" disabled={loading}>
            <span className="action-icon">🔄</span>
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          
          {currentUser && (currentUser.isAdmin || currentUser.email === 'admin@quiz.com') && (
            <Link to="/admin" className="action-btn admin">
              <span className="action-icon">⚙️</span>
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      {userStats && (
        <div className="achievements-section">
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {userStats.totalQuizzes >= 1 && (
              <div className="achievement-badge earned">
                <div className="badge-icon">🎯</div>
                <div className="badge-info">
                  <h4>First Steps</h4>
                  <p>Completed your first quiz</p>
                </div>
              </div>
            )}
            
            {userStats.totalQuizzes >= 5 && (
              <div className="achievement-badge earned">
                <div className="badge-icon">🔥</div>
                <div className="badge-info">
                  <h4>Getting Started</h4>
                  <p>Completed 5 quizzes</p>
                </div>
              </div>
            )}
            
            {userStats.totalQuizzes >= 10 && (
              <div className="achievement-badge earned">
                <div className="badge-icon">⭐</div>
                <div className="badge-info">
                  <h4>Quiz Enthusiast</h4>
                  <p>Completed 10 quizzes</p>
                </div>
              </div>
            )}
            
            {userStats.averageScore >= 80 && (
              <div className="achievement-badge earned">
                <div className="badge-icon">🏆</div>
                <div className="badge-info">
                  <h4>High Achiever</h4>
                  <p>Average score above 80%</p>
                </div>
              </div>
            )}
            
            {userStats.averageScore >= 90 && (
              <div className="achievement-badge earned">
                <div className="badge-icon">👑</div>
                <div className="badge-info">
                  <h4>Quiz Master</h4>
                  <p>Average score above 90%</p>
                </div>
              </div>
            )}
            
            {/* Placeholder badges for future achievements */}
            {userStats.totalQuizzes < 25 && (
              <div className="achievement-badge locked">
                <div className="badge-icon">🎖️</div>
                <div className="badge-info">
                  <h4>Dedicated Learner</h4>
                  <p>Complete 25 quizzes</p>
                  <small>{25 - userStats.totalQuizzes} more to go</small>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="profile-footer">
        <p>
          <strong>Total Quizzes Available:</strong> {topics.length} topics
        </p>
        <p>
          <strong>Your Progress:</strong> {quizHistory.length} quizzes completed
        </p>
        {userStats && (
          <p>
            <strong>Best Score:</strong> {userStats.bestScore || 0}% 
            {userStats.lastQuizDate && (
              <span> • Last Quiz: {formatDate(userStats.lastQuizDate)}</span>
            )}
          </p>
        )}
        <p>
          <strong>Debug:</strong> Last refresh at {lastRefresh || 'Never'}
        </p>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  limit
} from 'firebase/firestore';
import MigrationComponent from '../components/MigrationComponent';
import './AdminPanel.css';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboards'); // Start with leaderboards
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [topicStats, setTopicStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  
  // Store unsubscribe function for real-time listener
  const unsubscribeRef = useRef(null);

  // Form states
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    topicId: '',
    difficulty: 'medium'
  });

  // Check if user is admin
  const isAdmin = currentUser && (currentUser.isAdmin || currentUser.email === 'admin@quiz.com');

  useEffect(() => {
    console.log('Current user:', currentUser);
    console.log('Is admin:', isAdmin);
    if (isAdmin) {
      fetchTopics();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedTopic && activeTab === 'manage-questions') {
      fetchQuestions();
    }
  }, [selectedTopic, activeTab]);

  // Enhanced real-time leaderboard effect
  useEffect(() => {
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (selectedTopic && activeTab === 'leaderboards' && realtimeEnabled) {
      setLoading(true);

      // Set up real-time listener for quiz history
      const q = query(
        collection(db, 'quizHistory'),
        where('topicId', '==', selectedTopic),
        orderBy('percentage', 'desc'),
        orderBy('timeSpent', 'asc'),
        limit(50) // Limit to top 50 for performance
      );

      unsubscribeRef.current = onSnapshot(q, async (querySnapshot) => {
        try {
          const userBestScores = new Map();

          // Process all quiz attempts to get best scores per user
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const userId = data.userId;
            const currentScore = data.percentage;
            const currentTime = data.timeSpent;

            // Keep only the best score for each user (or fastest time if same score)
            if (!userBestScores.has(userId) || 
                userBestScores.get(userId).percentage < currentScore ||
                (userBestScores.get(userId).percentage === currentScore && 
                 userBestScores.get(userId).timeSpent > currentTime)) {
              userBestScores.set(userId, {
                ...data,
                id: docSnapshot.id
              });
            }
          });

          // Sort by score (highest first), then by time (fastest first)
          const sortedResults = Array.from(userBestScores.values())
            .sort((a, b) => {
              if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
              }
              return a.timeSpent - b.timeSpent;
            });

          // Add ranking and process user data
          const rankedResults = sortedResults.map((result, index) => ({
            ...result,
            rank: index + 1,
            userName: result.userName || result.userEmail?.split('@')[0] || 'Anonymous',
            userEmail: result.userEmail || 'N/A',
            isCurrentUser: currentUser && result.userId === currentUser.uid,
            completedAt: result.completedAt || result.createdAt,
            medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null
          }));

          console.log('Processed leaderboard data:', rankedResults);
          setLeaderboardData(rankedResults);

          // Calculate enhanced statistics
          const allAttempts = querySnapshot.docs.map(doc => doc.data());
          const stats = {
            totalAttempts: querySnapshot.size,
            uniqueUsers: rankedResults.length,
            averageScore: rankedResults.length > 0
              ? Math.round((rankedResults.reduce((sum, user) => sum + user.percentage, 0) / rankedResults.length) * 100) / 100
              : 0,
            topScore: rankedResults.length > 0 ? rankedResults[0].percentage : 0,
            averageTime: rankedResults.length > 0
              ? Math.round(rankedResults.reduce((sum, user) => sum + user.timeSpent, 0) / rankedResults.length)
              : 0,
            fastestTime: rankedResults.length > 0 
              ? Math.min(...rankedResults.map(r => r.timeSpent))
              : 0,
            scoreDistribution: {
              excellent: rankedResults.filter(r => r.percentage >= 90).length,
              good: rankedResults.filter(r => r.percentage >= 70 && r.percentage < 90).length,
              average: rankedResults.filter(r => r.percentage >= 50 && r.percentage < 70).length,
              needsImprovement: rankedResults.filter(r => r.percentage < 50).length
            }
          };

          setTopicStats(stats);
          setLoading(false);
        } catch (error) {
          console.error('Error processing leaderboard data:', error);
          setLoading(false);
        }
      }, (error) => {
        console.error('Error fetching real-time leaderboard data:', error);
        setLoading(false);
      });
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [selectedTopic, activeTab, currentUser, realtimeEnabled]);

  const fetchTopics = async () => {
    console.log('Fetching topics...');
    setTopicsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'topics'));
      console.log('Topics query snapshot size:', querySnapshot.size);
      
      const topicsData = querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        console.log('Topic data:', data);
        return data;
      });
      
      console.log('All topics data:', topicsData);
      setTopics(topicsData);
      setTopicsLoading(false);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicsLoading(false);
    }
  };

  const createSampleTopics = async () => {
    try {
      const sampleTopics = [
        { name: 'JavaScript', description: 'JavaScript programming language' },
        { name: 'React', description: 'React framework' },
        { name: 'Node.js', description: 'Node.js runtime' },
        { name: 'HTML/CSS', description: 'Web markup and styling' },
        { name: 'Python', description: 'Python programming language' }
      ];

      console.log('Creating sample topics...');
      for (const topic of sampleTopics) {
        await addDoc(collection(db, 'topics'), topic);
      }
      
      alert('Sample topics created successfully!');
      fetchTopics(); // Refresh the topics list
    } catch (error) {
      console.error('Error creating sample topics:', error);
      alert('Error creating sample topics');
    }
  };

  const fetchQuestions = async () => {
    try {
      const q = query(collection(db, 'questions'), where('topicId', '==', selectedTopic));
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        ...newQuestion,
        createdAt: new Date(),
        isActive: true
      };
      
      await addDoc(collection(db, 'questions'), questionData);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        topicId: '',
        difficulty: 'medium'
      });
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteDoc(doc(db, 'questions', questionId));
        fetchQuestions();
        alert('Question deleted successfully!');
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question');
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportLeaderboardData = () => {
    const csvContent = [
      ['Rank', 'Name', 'Email', 'Score (%)', 'Correct Answers', 'Total Questions', 'Time Spent', 'Date'],
      ...leaderboardData.map(entry => [
        entry.rank,
        entry.userName,
        entry.userEmail,
        entry.percentage,
        entry.correctAnswers,
        entry.totalQuestions,
        formatTime(entry.timeSpent),
        entry.completedAt ? new Date(entry.completedAt.toDate()).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-${selectedTopic}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
            <strong>Debug Info:</strong>
            <p>Current User: {currentUser ? currentUser.email : 'Not logged in'}</p>
            <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
            <p>Admin Check: {currentUser?.isAdmin ? 'Has isAdmin flag' : 'No isAdmin flag'} | {currentUser?.email === 'admin@quiz.com' ? 'Is admin email' : 'Not admin email'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      {/* Debug Info */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '5px', fontSize: '12px' }}>
        <strong>Debug Info:</strong> 
        <span> Topics loaded: {topics.length} | </span>
        <span> Loading: {topicsLoading ? 'Yes' : 'No'} | </span>
        <span> Current User: {currentUser?.email}</span>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'leaderboards' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboards')}
        >
          📊 Leaderboards & Rankings
        </button>
        <button 
          className={activeTab === 'add-questions' ? 'active' : ''}
          onClick={() => setActiveTab('add-questions')}
        >
          ➕ Add Questions
        </button>
        <button 
          className={activeTab === 'manage-questions' ? 'active' : ''}
          onClick={() => setActiveTab('manage-questions')}
        >
          📝 Manage Questions
        </button>
        <button 
          className={activeTab === 'migration' ? 'active' : ''}
          onClick={() => setActiveTab('migration')}
        >
          🔄 Migration
        </button>
      </div>

      {activeTab === 'leaderboards' && (
        <div className="tab-content">
          <div className="leaderboard-header">
            <h2>📊 Quiz Rankings & Leaderboards</h2>
            <div className="leaderboard-controls">
              <div className="form-group">
                <label>Select Quiz Topic:</label>
                {topicsLoading ? (
                  <p>Loading topics...</p>
                ) : (
                  <select 
                    value={selectedTopic} 
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  >
                    <option value="">Select Topic ({topics.length} available)</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="control-buttons">
                <button 
                  className={`toggle-btn ${realtimeEnabled ? 'active' : ''}`}
                  onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                >
                  {realtimeEnabled ? '🔴 Live' : '⚪ Static'}
                </button>
                
                {leaderboardData.length > 0 && (
                  <button 
                    className="export-btn"
                    onClick={exportLeaderboardData}
                  >
                    📥 Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedTopic && (
            <div className="leaderboard-section">
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading real-time rankings...</p>
                </div>
              ) : (
                <>
                  {/* Enhanced Statistics */}
                  <div className="stats-grid enhanced">
                    <div className="stat-card primary">
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <h3>Total Participants</h3>
                        <p className="stat-number">{topicStats.uniqueUsers || 0}</p>
                        <small>{topicStats.totalAttempts || 0} total attempts</small>
                      </div>
                    </div>
                    
                    <div className="stat-card success">
                      <div className="stat-icon">🏆</div>
                      <div className="stat-content">
                        <h3>Top Score</h3>
                        <p className="stat-number">{topicStats.topScore || 0}%</p>
                        <small>Best performance</small>
                      </div>
                    </div>
                    
                    <div className="stat-card info">
                      <div className="stat-icon">📊</div>
                      <div className="stat-content">
                        <h3>Average Score</h3>
                        <p className="stat-number">{topicStats.averageScore || 0}%</p>
                        <small>Overall performance</small>
                      </div>
                    </div>
                    
                    <div className="stat-card warning">
                      <div className="stat-icon">⚡</div>
                      <div className="stat-content">
                        <h3>Fastest Time</h3>
                        <p className="stat-number">{formatTime(topicStats.fastestTime || 0)}</p>
                        <small>Speed record</small>
                      </div>
                    </div>
                  </div>

                  {/* Score Distribution Chart */}
                  {topicStats.scoreDistribution && (
                    <div className="score-distribution">
                      <h3>Score Distribution</h3>
                      <div className="distribution-chart">
                        <div className="distribution-bar">
                          <div 
                            className="bar excellent" 
                            style={{ 
                              width: `${(topicStats.scoreDistribution.excellent / topicStats.uniqueUsers) * 100}%` 
                            }}
                          >
                            <span>{topicStats.scoreDistribution.excellent}</span>
                          </div>
                          <div 
                            className="bar good" 
                            style={{ 
                              width: `${(topicStats.scoreDistribution.good / topicStats.uniqueUsers) * 100}%` 
                            }}
                          >
                            <span>{topicStats.scoreDistribution.good}</span>
                          </div>
                          <div 
                            className="bar average" 
                            style={{ 
                              width: `${(topicStats.scoreDistribution.average / topicStats.uniqueUsers) * 100}%` 
                            }}
                          >
                            <span>{topicStats.scoreDistribution.average}</span>
                          </div>
                          <div 
                            className="bar needs-improvement" 
                            style={{ 
                              width: `${(topicStats.scoreDistribution.needsImprovement / topicStats.uniqueUsers) * 100}%` 
                            }}
                          >
                            <span>{topicStats.scoreDistribution.needsImprovement}</span>
                          </div>
                        </div>
                        <div className="distribution-legend">
                          <div className="legend-item">
                            <span className="legend-color excellent"></span>
                            <span>Excellent (90%+)</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color good"></span>
                            <span>Good (70-89%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color average"></span>
                            <span>Average (50-69%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color needs-improvement"></span>
                            <span>Needs Improvement (&lt;50%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-time indicator */}
                  {realtimeEnabled && (
                    <div className="real-time-indicator">
                      <span className="live-dot"></span>
                      <span>Live Data - Updates in Real Time</span>
                    </div>
                  )}

                  {/* Enhanced Leaderboard Table */}
                  {leaderboardData.length > 0 ? (
                    <div className="leaderboard-table enhanced">
                      <div className="table-header">
                        <h3>🏆 Top Performers</h3>
                        <span className="participant-count">{leaderboardData.length} participants</span>
                      </div>
                      
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>User</th>
                              <th>Score</th>
                              <th>Accuracy</th>
                              <th>Time</th>
                              <th>Date</th>
                              <th>Performance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaderboardData.map((entry) => (
                              <tr key={entry.id} className={`
                                ${entry.isCurrentUser ? 'current-user' : ''} 
                                ${entry.rank <= 3 ? 'top-three' : ''}
                                rank-${entry.rank}
                              `}>
                                <td>
                                  <div className="rank-cell">
                                    {entry.medal && <span className="medal">{entry.medal}</span>}
                                    <span className="rank-number">#{entry.rank}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="user-cell">
                                    <div className="user-avatar">
                                      {entry.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                      <span className="user-name">{entry.userName}</span>
                                      <small className="user-email">{entry.userEmail}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="score-cell">
                                    <span className="score-percentage">{entry.percentage}%</span>
                                    <div className="score-bar">
                                      <div 
                                        className="score-fill" 
                                        style={{ width: `${entry.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="accuracy">
                                    {entry.correctAnswers}/{entry.totalQuestions}
                                  </span>
                                </td>
                                <td>
                                  <span className="time-spent">
                                    {formatTime(entry.timeSpent)}
                                  </span>
                                </td>
                                <td>
                                  <span className="completion-date">
                                    {entry.completedAt ? 
                                      new Date(entry.completedAt.toDate()).toLocaleDateString() : 
                                      'N/A'
                                    }
                                  </span>
                                </td>
                                <td>
                                  <div className="performance-indicators">
                                    {entry.percentage >= 90 && <span className="indicator excellent">🌟</span>}
                                    {entry.percentage >= 80 && entry.percentage < 90 && <span className="indicator good">👍</span>}
                                    {entry.timeSpent === topicStats.fastestTime && <span className="indicator fastest">⚡</span>}
                                    {entry.rank === 1 && <span className="indicator champion">👑</span>}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <div className="no-data-icon">📊</div>
                      <h3>No Quiz Attempts Yet</h3>
                      <p>No quiz attempts found for this topic. Encourage users to take quizzes!</p>
                      <small>Make sure users have completed quizzes for this topic and that the data is being saved to the 'quizHistory' collection.</small>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add-questions' && (
        <div className="tab-content">
          <h2>Add New Question</h2>
          
          {/* Show button to create sample topics if no topics exist */}
          {topics.length === 0 && !topicsLoading && (
            <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
              <p><strong>No topics found!</strong> You need to create some topics first.</p>
              <button 
                onClick={createSampleTopics}
                style={{ 
                  background: '#ffc107', 
                  color: '#212529', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Create Sample Topics
              </button>
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="question-form">
            <div className="form-group">
              <label>Topic:</label>
              {topicsLoading ? (
                <p>Loading topics...</p>
              ) : (
                <select 
                  value={newQuestion.topicId} 
                  onChange={(e) => setNewQuestion({...newQuestion, topicId: e.target.value})}
                  required
                >
                  <option value="">Select Topic ({topics.length} available)</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Question:</label>
              <textarea 
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Options:</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswer === index}
                    onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                  />
                  <label>Correct</label>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Difficulty:</label>
              <select 
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={topics.length === 0}>
              Add Question
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage-questions' && (
        <div className="tab-content">
          <h2>Manage Questions</h2>
          <div className="form-group">
            <label>Select Topic:</label>
            {topicsLoading ? (
              <p>Loading topics...</p>
            ) : (
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">Select Topic ({topics.length} available)</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
                </select>
                )}
              </div>

              {selectedTopic && (
                <div className="questions-list">
                  <h3>Questions for Selected Topic ({questions.length} questions)</h3>
                  {questions.length > 0 ? (
                    <div className="questions-grid">
                      {questions.map((question, index) => (
                        <div key={question.id} className="question-card">
                          <div className="question-header">
                            <span className="question-number">Q{index + 1}</span>
                            <span className={`difficulty-badge ${question.difficulty}`}>
                              {question.difficulty}
                            </span>
                          </div>
                          
                          <div className="question-content">
                            <h4>{question.question}</h4>
                            <div className="options-list">
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex} 
                                  className={`option ${question.correctAnswer === optIndex ? 'correct' : ''}`}
                                >
                                  <span className="option-letter">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span className="option-text">{option}</span>
                                  {question.correctAnswer === optIndex && (
                                    <span className="correct-indicator">✓</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="question-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => handleEditQuestion(question)}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          
                          <div className="question-meta">
                            <small>
                              Created: {question.createdAt ? 
                                new Date(question.createdAt.toDate()).toLocaleDateString() : 
                                'N/A'
                              }
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-questions">
                      <div className="no-questions-icon">❓</div>
                      <h3>No Questions Found</h3>
                      <p>No questions have been added for this topic yet.</p>
                      <p>Use the "Add Questions" tab to create some questions.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'migration' && (
            <div className="tab-content">
              <h2>🔄 Data Migration</h2>
              <p>Use this tool to migrate data between different formats or update existing data structures.</p>
              <MigrationComponent />
            </div>
          )}
        </div>
      );
    };

    export default AdminPanel;
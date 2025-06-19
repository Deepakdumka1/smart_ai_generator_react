import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  setDoc
} from 'firebase/firestore';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [topicInfo, setTopicInfo] = useState(null);
  const [quizHistoryId, setQuizHistoryId] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Get results data from navigation state or load from database
  const [resultsData, setResultsData] = useState(location.state);

  useEffect(() => {
    console.log('🎯 Results component mounted');
    console.log('📊 Location state:', location.state);
    console.log('🔍 Quiz ID from params:', quizId);
    console.log('👤 Current user:', currentUser?.email);

    // If no results data and we have a quizId, try to load from database
    if (!resultsData && quizId) {
      console.log('📥 Loading quiz results from database...');
      loadQuizResults();
    } else if (!resultsData && !quizId) {
      console.log('❌ No results data and no quiz ID - redirecting to topics');
      navigate('/topics');
      return;
    }

    if (resultsData && currentUser && !saved) {
      console.log('✅ Results data found, processing...');
      setDebugInfo('Processing quiz results...');
      
      // Fetch topic information
      fetchTopicInfo();
      
      // Save results to Firebase
      saveResults();
    }
  }, [resultsData, quizId, navigate, currentUser, saved]);

  const loadQuizResults = async () => {
    if (!quizId) return;

    try {
      setDebugInfo('Loading quiz results from database...');
      const quizDoc = await getDoc(doc(db, 'quizHistory', quizId));
      if (quizDoc.exists()) {
        const data = quizDoc.data();
        console.log('📊 Loaded quiz data:', data);
        setResultsData(data);
        setQuizHistoryId(quizId);
        setSaved(true);
        setDebugInfo('Quiz results loaded from database');
      } else {
        console.log('❌ Quiz not found in database');
        setError('Quiz results not found');
        navigate('/topics');
      }
    } catch (error) {
      console.error('❌ Error loading quiz results:', error);
      setError(`Error loading quiz: ${error.message}`);
      navigate('/topics');
    }
  };

  const fetchTopicInfo = async () => {
    if (!resultsData?.topicId) {
      console.log('⚠️ No topic ID in results data');
      return;
    }

    try {
      console.log('🏷️ Fetching topic info for:', resultsData.topicId);
      setDebugInfo('Fetching topic information...');
      
      const topicDoc = await getDoc(doc(db, 'topics', resultsData.topicId));
      if (topicDoc.exists()) {
        const topicData = topicDoc.data();
        console.log('✅ Topic info loaded:', topicData);
        setTopicInfo(topicData);
        setDebugInfo('Topic information loaded');
      } else {
        console.log('⚠️ Topic not found, using default');
        setTopicInfo({
          name: resultsData.topicName || 'Unknown Topic',
          description: 'Topic information not available',
          color: '#6c757d',
          icon: '📝'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching topic info:', error);
      setDebugInfo(`Error fetching topic: ${error.message}`);
    }
  };

  const saveResults = async () => {
    if (!currentUser || !resultsData || saved || saving) {
      console.log('⏭️ Skipping save - already saved or missing data');
      return;
    }

    console.log('💾 Starting to save quiz results...');
    setSaving(true);
    setDebugInfo('Saving quiz results...');
    
    try {
      // Prepare the result data with all necessary fields
      const resultToSave = {
        // User information
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        userPhotoURL: currentUser.photoURL || null,
        
        // Quiz information
        topicId: resultsData.topicId,
        topicName: resultsData.topicName,
        
        // Score information
        score: resultsData.score || resultsData.correctAnswers,
        totalQuestions: resultsData.totalQuestions,
        correctAnswers: resultsData.correctAnswers,
        incorrectAnswers: resultsData.totalQuestions - resultsData.correctAnswers,
        percentage: Math.round((resultsData.correctAnswers / resultsData.totalQuestions) * 100),
        
        // Time information
        timeSpent: resultsData.timeSpent || 0,
        
        // Quiz settings
        difficulty: resultsData.difficulty || 'all',
        
        // Detailed results
        answers: resultsData.answers || [],
        questions: resultsData.questions || [],
        detailedResults: resultsData.detailedResults || [],
        
        // Timestamps
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        
        // Status flags
        isCompleted: true,
        attemptNumber: 1,
        
        // Device information
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          timestamp: new Date().toISOString()
        }
      };

      console.log('📝 Saving quiz result:', resultToSave);

      // Save to quiz history
      const docRef = await addDoc(collection(db, 'quizHistory'), resultToSave);
      const savedId = docRef.id;
      
      console.log('✅ Quiz result saved with ID:', savedId);
      setQuizHistoryId(savedId);
      setDebugInfo(`Quiz results saved successfully (ID: ${savedId})`);
      
      // Update user statistics
      await updateUserStats(resultToSave);
      
      // Calculate user rank
      await calculateUserRank(resultToSave);
      
      setSaved(true);
      
      // Update URL to include quiz ID for sharing
      window.history.replaceState(null, '', `/results/${savedId}`);
      
      console.log('🎉 All data saved successfully!');
      setDebugInfo('All data saved successfully!');
      
    } catch (error) {
      console.error('❌ Error saving results:', error);
      setError(`Error saving results: ${error.message}`);
      setDebugInfo(`Error saving results: ${error.message}`);
      
      // Show detailed error information
      if (error.code === 'permission-denied') {
        setError('Permission denied. Please check your login status and try again.');
      } else if (error.code === 'unavailable') {
        setError('Database temporarily unavailable. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const updateUserStats = async (resultData) => {
    try {
      console.log('📈 Updating user stats...');
      setDebugInfo('Updating user statistics...');
      
      // Use the user's UID as the document ID for easier querying
      const userStatsRef = doc(db, 'userStats', currentUser.uid);
      const userStatsDoc = await getDoc(userStatsRef);
      
      if (userStatsDoc.exists()) {
        // Update existing stats
        const currentStats = userStatsDoc.data();
        const newTotalQuizzes = (currentStats.totalQuizzes || 0) + 1;
        const newTotalQuestions = (currentStats.totalQuestions || 0) + resultData.totalQuestions;
        const newTotalCorrect = (currentStats.totalCorrectAnswers || 0) + resultData.correctAnswers;
        const newAverageScore = Math.round((newTotalCorrect / newTotalQuestions) * 100);
        
        await updateDoc(userStatsRef, {
          totalQuizzes: newTotalQuizzes,
          totalQuestions: newTotalQuestions,
          totalCorrectAnswers: newTotalCorrect,
          totalTimeSpent: increment(resultData.timeSpent),
          averageScore: newAverageScore,
          lastQuizDate: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ User stats updated');
      } else {
        // Create new stats document with user ID as document ID
        const newStats = {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          userName: resultData.userName,
          totalQuizzes: 1,
          totalQuestions: resultData.totalQuestions,
          totalCorrectAnswers: resultData.correctAnswers,
          totalTimeSpent: resultData.timeSpent,
          averageScore: resultData.percentage,
          firstQuizDate: serverTimestamp(),
          lastQuizDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userStatsRef, newStats);
        console.log('✅ New user stats created');
      }
      
      setDebugInfo('User statistics updated');
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
      setDebugInfo(`Error updating user stats: ${error.message}`);
    }
  };

  const calculateUserRank = async (resultData) => {
    try {
      console.log('🏆 Calculating user rank...');
      setDebugInfo('Calculating your rank...');
      
      // Get all quiz attempts for this topic
      const quizHistoryQuery = query(
        collection(db, 'quizHistory'),
        where('topicId', '==', resultData.topicId),
        orderBy('percentage', 'desc'),
        orderBy('timeSpent', 'asc')
      );
      
      const snapshot = await getDocs(quizHistoryQuery);
      
      // Create a map to store best scores per user
      const userBestScores = new Map();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId;
        const currentScore = data.percentage;
        const currentTime = data.timeSpent;
        
        if (!userBestScores.has(userId) || 
            userBestScores.get(userId).percentage < currentScore ||
            (userBestScores.get(userId).percentage === currentScore && 
             userBestScores.get(userId).timeSpent > currentTime)) {
          userBestScores.set(userId, {
            percentage: currentScore,
            timeSpent: currentTime,
            userId: userId
          });
        }
      });
      
      // Sort users by score and time
      const sortedUsers = Array.from(userBestScores.values())
        .sort((a, b) => {
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return a.timeSpent - b.timeSpent;
        });
      
      // Find current user's rank
      const userRankIndex = sortedUsers.findIndex(user => user.userId === currentUser.uid);
      const rank = userRankIndex + 1;
      const total = sortedUsers.length;
      
      console.log('🏆 User rank calculated:', rank, 'out of', total);
      setUserRank(rank);
      setTotalParticipants(total);
      setDebugInfo(`Your rank: #${rank} out of ${total} participants`);
      
    } catch (error) {
      console.error('❌ Error calculating rank:', error);
      setDebugInfo(`Error calculating rank: ${error.message}`);
    }
  };

  // Manual save function for debugging
  const forceSave = async () => {
    setSaved(false);
    setSaving(false);
    await saveResults();
  };

  // Test database connection
  const testConnection = async () => {
    try {
      setDebugInfo('Testing database connection...');
      
      // Test write permission
      const testDoc = {
        test: true,
        userId: currentUser.uid,
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'quizHistory'), testDoc);
      console.log('✅ Test document created:', docRef.id);
      
      // Clean up test document
      await docRef.delete();
      
      setDebugInfo('Database connection successful!');
    } catch (error) {
      console.error('❌ Database test failed:', error);
      setDebugInfo(`Database test failed: ${error.message}`);
      setError(`Database connection failed: ${error.message}`);
    }
  };

  // If no results data, show loading or redirect
  if (!resultsData) {
    return (
      <div className="results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading results...</p>
          {debugInfo && <p className="debug-info">{debugInfo}</p>}
          {error && <p className="error-info">{error}</p>}
        </div>
      </div>
    );
  }

  const {
    score,
    totalQuestions,
    correctAnswers,
    percentage = Math.round((correctAnswers / totalQuestions) * 100),
    timeSpent,
    topicName,
    difficulty,
    answers,
    questions
  } = resultsData;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745'; // Green
    if (percentage >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return { emoji: '🏆', message: 'Outstanding! You\'re a quiz master!' };
    if (percentage >= 80) return { emoji: '🎉', message: 'Excellent work! Keep it up!' };
    if (percentage >= 70) return { emoji: '👏', message: 'Great job! You\'re doing well!' };
    if (percentage >= 60) return { emoji: '👍', message: 'Good effort! Room for improvement!' };
    if (percentage >= 50) return { emoji: '📚', message: 'Keep studying! You\'ll get there!' };
    return { emoji: '💪', message: 'Don\'t give up! Practice makes perfect!' };
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreInfo = getScoreMessage(percentage);

  return (
    <div className="results-container">
      {/* Debug Information */}
      <div className="debug-section">
        <details>
          <summary>🔧 Debug Information</summary>
          <div className="debug-content">
            <p><strong>User:</strong> {currentUser?.email} (ID: {currentUser?.uid})</p>
            <p><strong>Quiz ID:</strong> {quizHistoryId || 'Not saved yet'}</p>
            <p><strong>Topic:</strong> {topicName} (ID: {resultsData.topicId})</p>
            <p><strong>Score:</strong> {percentage}% ({correctAnswers}/{totalQuestions})</p>
            <p><strong>Time:</strong> {formatTime(timeSpent)}</p>
            <p><strong>Saved:</strong> {saved ? 'Yes' : 'No'}</p>
            <p><strong>Saving:</strong> {saving ? 'Yes' : 'No'}</p>
            <p><strong>Rank:</strong> {userRank ? `#${userRank} of ${totalParticipants}` : 'Calculating...'}</p>
            <p><strong>Status:</strong> {debugInfo}</p>
            {error && <p style={{color: 'red'}}><strong>Error:</strong> {error}</p>}
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={forceSave} className="debug-btn" disabled={saving}>
                🔄 Force Save
              </button>
              <button onClick={testConnection} className="debug-btn">
                🧪 Test Connection
              </button>
              <button onClick={() => navigate('/profile')} className="debug-btn">
                👤 View Profile
              </button>
            </div>
            
            {resultsData && (
              <details style={{ marginTop: '15px' }}>
                <summary>📊 Raw Results Data</summary>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(resultsData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </details>
      </div>

      {/* Results Header */}
      <div className="results-header">
        <div className="score-circle" style={{ borderColor: getScoreColor(percentage) }}>
          <div className="score-percentage" style={{ color: getScoreColor(percentage) }}>
            {percentage}%
          </div>
          <div className="score-label">Score</div>
        </div>
        
        <div className="results-title">
          <div className="score-emoji">{scoreInfo.emoji}</div>
          <h1>Quiz Complete!</h1>
          <p className="score-message">{scoreInfo.message}</p>
          
          {/* Show ranking if available */}
          {userRank && totalParticipants && (
            <div className="ranking-info">
              <div className="rank-badge">
                <span className="rank-number">#{userRank}</span>
                <span className="rank-text">out of {totalParticipants} participants</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Topic Info */}
      {topicInfo && (
        <div className="topic-summary">
          <div className="topic-icon" style={{ backgroundColor: topicInfo.color }}>
            {topicInfo.icon}
          </div>
          <div className="topic-details">
            <h2>{topicName}</h2>
            <p>{topicInfo.description}</p>
          </div>
        </div>
      )}

      {/* Results Stats */}
      <div className="results-stats">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{correctAnswers}</div>
          <div className="stat-label">Correct</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{totalQuestions - correctAnswers}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{totalQuestions}</div>
          <div className="stat-label">Total</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatTime(timeSpent)}</div>
          <div className="stat-label">Time</div>
        </div>
      </div>

      {/* Difficulty Badge */}
      {difficulty && difficulty !== 'all' && (
        <div className="difficulty-badge">
          <span className={`difficulty-tag ${difficulty}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
          </span>
        </div>
      )}

      {/* Save Status */}
      {saving && (
        <div className="save-status saving">
          <div className="spinner small"></div>
          <span>Saving results...</span>
        </div>
      )}
      
      {saved && (
        <div className="save-status saved">
          <span className="save-icon">✅</span>
          <span>Results saved to your quiz history!</span>
        </div>
      )}

      {error && (
        <div className="save-status" style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
          <span>❌</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="results-actions">
        <Link to="/topics" className="btn btn-primary">
          Try Another Topic
        </Link>
        
        <Link to={`/quiz/${resultsData.topicId}`} className="btn btn-secondary">
          Retake Quiz
        </Link>
        
        <Link to="/profile" className="btn btn-outline">
          View Quiz History
        </Link>
      </div>

      {/* Share Results */}
      <div className="share-section">
        <h4>Share Your Achievement</h4>
        <div className="share-buttons">
          <button 
            className="share-btn twitter"
            onClick={() => {
              const text = `I just scored ${percentage}% on the ${topicName} quiz! 🎉`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }}
          >
            Share on Twitter
          </button>
          
          <button 
            className="share-btn copy"
            onClick={() => {
              const shareUrl = window.location.href;
              const text = `Check out my quiz result: ${shareUrl}`;
              navigator.clipboard.writeText(text);
              alert('Link copied to clipboard!');
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
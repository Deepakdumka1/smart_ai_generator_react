import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { topicsData } from '../../data/topicsData';

const LeaderboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const LeaderboardTitle = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
`;

const TopicSelector = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const TopicSelect = styled.select`
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 250px;
`;

const LeaderboardCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const LeaderboardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
`;

const TopicName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const TopicStats = styled.p`
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e3f2fd;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 700;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
`;

const RankCell = styled(TableCell)`
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: ${props => 
    props.rank === 1 ? '#ffd700' :
    props.rank === 2 ? '#c0c0c0' :
    props.rank === 3 ? '#cd7f32' : '#333'
  };
`;

const ScoreCell = styled(TableCell)`
  font-weight: 700;
  color: ${props => 
    props.score >= 90 ? '#28a745' :
    props.score >= 70 ? '#ffc107' : '#dc3545'
  };
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 12px;
`;

const RefreshButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 20px;
  
  &:hover {
    background: #218838;
  }
`;

const LeaderboardManager = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (selectedTopic !== 'all') {
      fetchLeaderboardData(selectedTopic);
    } else {
      setLeaderboardData([]);
    }
  }, [selectedTopic]);

  const fetchLeaderboardData = async (topicId) => {
    setLoading(true);
    try {
      // Fetch quiz history for the selected topic
      const q = query(
        collection(db, 'quizHistory'),
        where('topicId', '==', topicId),
        orderBy('scorePercentage', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const quizResults = [];
      const userBestScores = new Map();
      
      // Process results to get best score per user
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId;
        const currentScore = data.scorePercentage;
        
        if (!userBestScores.has(userId) || userBestScores.get(userId).scorePercentage < currentScore) {
          userBestScores.set(userId, {
            ...data,
            id: doc.id
          });
        }
      });
      
      // Convert to array and sort by score
      const sortedResults = Array.from(userBestScores.values())
        .sort((a, b) => b.scorePercentage - a.scorePercentage)
        .slice(0, 50); // Top 50 users
      
      // Fetch user details
      const usersData = await Promise.all(
        sortedResults.map(async (result) => {
          try {
            const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', result.userId)));
            const userData = userDoc.docs[0]?.data();
            return {
              ...result,
              userName: userData?.firstName && userData?.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.email?.split('@')[0] || 'Unknown User',
              userEmail: userData?.email || 'No email'
            };
          } catch (error) {
            console.error('Error fetching user data:', error);
            return {
              ...result,
              userName: 'Unknown User',
              userEmail: 'No email'
            };
          }
        })
      );
      
      setLeaderboardData(usersData);
      
      // Calculate stats
      const totalAttempts = querySnapshot.size;
      const avgScore = usersData.length > 0 
        ? usersData.reduce((sum, user) => sum + user.scorePercentage, 0) / usersData.length
        : 0;
      
      setStats({
        totalAttempts,
        uniqueUsers: usersData.length,
        averageScore: Math.round(avgScore * 100) / 100,
        topScore: usersData.length > 0 ? usersData[0].scorePercentage : 0
      });
      
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopicName = (topicId) => {
    const topic = topicsData.find(t => t.id === topicId);
    return topic ? topic.name : topicId;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <LeaderboardContainer>
      <LeaderboardTitle>Quiz Leaderboards</LeaderboardTitle>
      
      <TopicSelector>
        <TopicSelect
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="all">Select a topic to view leaderboard</option>
          {topicsData.map(topic => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </TopicSelect>
        
        {selectedTopic !== 'all' && (
          <RefreshButton onClick={() => fetchLeaderboardData(selectedTopic)}>
            Refresh Data
          </RefreshButton>
        )}
      </TopicSelector>

      {selectedTopic !== 'all' && (
        <LeaderboardCard>
          <LeaderboardHeader>
            <TopicName>{getTopicName(selectedTopic)} Leaderboard</TopicName>
            <TopicStats>
              {stats.totalAttempts} total attempts • {stats.uniqueUsers} users • 
              Average Score: {stats.averageScore}%
            </TopicStats>
          </LeaderboardHeader>
          
          {loading ? (
            <LoadingMessage>Loading leaderboard data...</LoadingMessage>
          ) : leaderboardData.length === 0 ? (
            <NoDataMessage>
              No quiz attempts found for this topic yet.
            </NoDataMessage>
          ) : (
            <LeaderboardTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Rank</TableHeaderCell>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                  <TableHeaderCell>Correct Answers</TableHeaderCell>
                  <TableHeaderCell>Date Completed</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={user.id}>
                    <RankCell rank={index + 1}>
                      {getRankIcon(index + 1)}
                    </RankCell>
                    <TableCell>
                      <div>
                        <strong>{user.userName}</strong>
                        <br />
                        <small style={{ color: '#666' }}>{user.userEmail}</small>
                      </div>
                    </TableCell>
                    <ScoreCell score={user.scorePercentage}>
                      {user.scorePercentage}%
                    </ScoreCell>
                    <TableCell>
                      {user.correctAnswers} / {user.totalQuestions}
                    </TableCell>
                    <TableCell>
                      {formatDate(user.completedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </LeaderboardTable>
          )}
        </LeaderboardCard>
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardManager;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { topicsData } from '../data/topicsData';
import { useAuth } from '../context/AuthContext';

const LeaderboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const LeaderboardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 40px;
  text-align: center;
`;

const LeaderboardTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 700;
`;

const LeaderboardSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const TopicCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid ${props => props.selected ? '#667eea' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const TopicCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
`;

const TopicCardTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
`;

const TopicCardStats = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const LeaderboardSection = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 30px;
`;

const LeaderboardSectionHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
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

const CurrentUserRow = styled(TableRow)`
  background: #fff3cd !important;
  border: 2px solid #ffc107;
  
  &:hover {
    background: #fff3cd !important;
  }
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
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  
  &:hover {
    background: #5a6268;
  }
`;

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [topicStats, setTopicStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTopic) {
      fetchLeaderboardData(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchLeaderboardData = async (topicId) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'quizHistory'),
        where('topicId', '==', topicId),
        orderBy('scorePercentage', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userBestScores = new Map();
      
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
      
      const sortedResults = Array.from(userBestScores.values())
        .sort((a, b) => b.scorePercentage - a.scorePercentage);
      
      const usersData = await Promise.all(
        sortedResults.map(async (result) => {
          try {
            const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', result.userId)));
            const userData = userDoc.docs[0]?.data();
            return {
              ...result,
              userName: userData?.firstName && userData?.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.email?.split('@')[0] || 'Anonymous',
              isCurrentUser: currentUser && result.userId === currentUser.uid
            };
          } catch (error) {
            return {
              ...result,
              userName: 'Anonymous',
              isCurrentUser: currentUser && result.userId === currentUser.uid
            };
          }
        })
      );
      
      setLeaderboardData(usersData);
      
      const stats = {
        totalAttempts: querySnapshot.size,
        uniqueUsers: usersData.length,
        averageScore: usersData.length > 0 
          ? Math.round((usersData.reduce((sum, user) => sum + user.scorePercentage, 0) / usersData.length) * 100) / 100
          : 0,
        topScore: usersData.length > 0 ? usersData[0].scorePercentage : 0
      };
      
      setTopicStats(stats);
      
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
      day: 'numeric'
    });
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (selectedTopic) {
    const topic = topicsData.find(t => t.id === selectedTopic);
    
    return (
      <LeaderboardContainer>
        <BackButton onClick={() => setSelectedTopic(null)}>
          ← Back to Topics
        </BackButton>
        
        <LeaderboardSection>
          <LeaderboardSectionHeader>
            <SectionTitle>{topic.name} Leaderboard</SectionTitle>
            <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
              {topicStats.totalAttempts} attempts • {topicStats.uniqueUsers} users • 
              Average: {topicStats.averageScore}%
            </p>
          </LeaderboardSectionHeader>
          
          {loading ? (
            <LoadingMessage>Loading leaderboard...</LoadingMessage>
          ) : leaderboardData.length === 0 ? (
            <NoDataMessage>No quiz attempts found for this topic yet.</NoDataMessage>
          ) : (
            <LeaderboardTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Rank</TableHeaderCell>
                  <TableHeaderCell>Player</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                  <TableHeaderCell>Correct</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {leaderboardData.map((user, index) => {
                  const RowComponent = user.isCurrentUser ? CurrentUserRow : TableRow;
                  return (
                    <RowComponent key={user.id}>
                      <RankCell rank={index + 1}>
                        {getRankIcon(index + 1)}
                      </RankCell>
                      <TableCell>
                        <strong>
                          {user.userName}
                          {user.isCurrentUser && ' (You)'}
                        </strong>
                      </TableCell>
                      <ScoreCell score={user.scorePercentage}>
                        {user.scorePercentage}%
                      </ScoreCell>
                      <TableCell>
                        {user.correctAnswers}/{user.totalQuestions}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.completedAt)}
                      </TableCell>
                    </RowComponent>
                  );
                })}
              </tbody>
            </LeaderboardTable>
          )}
        </LeaderboardSection>
      </LeaderboardContainer>
    );
  }

  return (
    <LeaderboardContainer>
      <LeaderboardHeader>
        <LeaderboardTitle>🏆 Leaderboards</LeaderboardTitle>
        <LeaderboardSubtitle>
          See how you rank against other quiz masters!
        </LeaderboardSubtitle>
      </LeaderboardHeader>
      
      <TopicsGrid>
        {topicsData.map((topic) => (
          <TopicCard 
            key={topic.id} 
            onClick={() => setSelectedTopic(topic.id)}
          >
            <TopicCardHeader>
              <TopicCardTitle>{topic.name}</TopicCardTitle>
            </TopicCardHeader>
            <TopicCardStats>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                {topic.description}
              </p>
              <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: '600' }}>
                Click to view leaderboard
              </p>
            </TopicCardStats>
          </TopicCard>
        ))}
      </TopicsGrid>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
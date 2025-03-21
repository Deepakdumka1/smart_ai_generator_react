import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import imageCompression from 'browser-image-compression';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #4361ee;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 auto 20px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

const ChangePhotoText = styled.span`
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 5px;
`;

const RemovePhotoText = styled.span`
  color: #ff4d6d;
  font-size: 0.7rem;
  text-align: center;
  padding: 0 10px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const FileInput = styled.input`
  display: none;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 5px;
`;

const ProfileEmail = styled.p`
  color: #6c757d;
  text-align: center;
  margin-bottom: 25px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavItem = styled.button`
  background-color: ${props => props.active ? '#4361ee' : 'transparent'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  border-radius: 8px;
  padding: 12px 15px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#3a56d4' : '#f8f9fa'};
  }
`;

const LogoutButton = styled.button`
  background-color: #f8f9fa;
  color: #ef476f;
  border: 1px solid #ef476f;
  border-radius: 8px;
  padding: 12px 15px;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    background-color: #ef476f;
    color: white;
  }
`;

const ProfileContent = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const ContentTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #3a56d4;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Label = styled.label`
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #4361ee;
    outline: none;
  }
`;

const SaveButton = styled.button`
  background-color: #4361ee;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  
  &:hover {
    background-color: #3a56d4;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  color: #38b000;
  background-color: rgba(56, 176, 0, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #ef476f;
  background-color: rgba(239, 71, 111, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
`;

const QuizHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QuizHistoryItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const QuizHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const QuizHistoryTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
`;

const QuizHistoryDate = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const QuizHistoryStats = styled.div`
  display: flex;
  gap: 15px;
`;

const QuizHistoryStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #4361ee;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #6c757d;
`;
const QuizHistoryLoading = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`;

const RetryButton = styled.button`
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #3a56d4;
  }
`;
const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [quizHistoryData, setQuizHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef(null);
  const { currentUser, updateProfile, logout, updateProfilePhoto } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Populate form with user data
    setFormData({
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      email: currentUser.email || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
      state: currentUser.state || '',
      zipCode: currentUser.zipCode || '',
      phone: currentUser.phone || ''
    });
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!currentUser?.uid) {
        setQuizHistoryData([]);
        return;
      }

      setHistoryLoading(true);
      setError('');

      try {
        // First, get the latest user document to ensure we have the most recent quiz history
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }

        const userData = userDoc.data();
        if (!userData.quizHistory || userData.quizHistory.length === 0) {
          setQuizHistoryData([]);
          setHistoryLoading(false);
          return;
        }

        // Fetch each quiz from quizHistory collection
        const quizPromises = userData.quizHistory.map(async (historyItem) => {
          try {
            const quizRef = doc(db, 'quizHistory', historyItem.quizId);
            const quizDoc = await getDoc(quizRef);

            if (quizDoc.exists()) {
              const quizData = quizDoc.data();
              return {
                id: historyItem.quizId,
                topicId: quizData.topicId,
                topicName: quizData.topicName,
                score: historyItem.score,
                totalQuestions: quizData.totalQuestions || quizData.questions?.length || 0,
                correctAnswers: quizData.correctAnswers,
                completedAt: historyItem.completedAt,
                duration: quizData.duration || 0
              };
            }
            return null;
          } catch (err) {
            console.error('Error fetching quiz:', historyItem.quizId, err);
            return null;
          }
        });

        const quizzes = await Promise.all(quizPromises);
        const validQuizzes = quizzes
          .filter(quiz => quiz !== null)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        setQuizHistoryData(validQuizzes);
      } catch (err) {
        console.error('Error fetching quiz history:', err);
        setError('Failed to load quiz history. Please try again.');
      } finally {
        setHistoryLoading(false);
      }
    };

    if (currentUser && activeTab === 'history') {
      fetchQuizHistory();
    }
  }, [currentUser, activeTab]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const renderQuizHistory = () => {
    if (error) {
      return (
        <ErrorMessage>
          {error}
          <RetryButton onClick={() => setActiveTab('history')}>
            Retry
          </RetryButton>
        </ErrorMessage>
      );
    }

    if (historyLoading) {
      return (
        <QuizHistoryLoading>
          <div>Loading quiz history...</div>
        </QuizHistoryLoading>
      );
    }

    if (!quizHistoryData || quizHistoryData.length === 0) {
      return (
        <EmptyState>
          <p>You haven't taken any quizzes yet.</p>
          <RetryButton as="a" href="/topics">
            Start a Quiz
          </RetryButton>
        </EmptyState>
      );
    }

    return (
      <QuizHistoryContainer>
        {quizHistoryData.map((quiz) => (
          <QuizHistoryItem
            key={quiz.id}
            onClick={() => handleQuizClick(quiz.id)}
          >
            <QuizHistoryHeader>
              <QuizHistoryTitle>{quiz.topicName || 'Unnamed Quiz'}</QuizHistoryTitle>
              <QuizHistoryDate>
                {formatDate(quiz.completedAt)}
              </QuizHistoryDate>
            </QuizHistoryHeader>

            <QuizHistoryStats>
              <QuizHistoryStat>
                <StatValue>
                  {quiz.score}%
                </StatValue>
                <StatLabel>Score</StatLabel>
              </QuizHistoryStat>

              <QuizHistoryStat>
                <StatValue>
                  {quiz.totalQuestions}
                </StatValue>
                <StatLabel>Questions</StatLabel>
              </QuizHistoryStat>

              <QuizHistoryStat>
                <StatValue>
                  {Math.floor(quiz.duration / 60)}m {Math.round(quiz.duration % 60)}s
                </StatValue>
                <StatLabel>Time Taken</StatLabel>
              </QuizHistoryStat>
            </QuizHistoryStats>
          </QuizHistoryItem>
        ))}
      </QuizHistoryContainer>
    );
  };


  if (!currentUser) {
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Don't update email as it's used for login
      const { email, ...updatableData } = formData;

      await updateProfile(updatableData);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuizClick = (quizId) => {
    navigate(`/results/${quizId}`);
  };

  const getInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = async (e) => {
    e.stopPropagation();

    if (!currentUser.photoURL) return;

    try {
      setPhotoLoading(true);
      setError('');

      await updateProfilePhoto(null);
      setSuccess('Profile photo removed successfully');
    } catch (err) {
      console.error('Error removing profile photo:', err);
      setError('Failed to remove profile photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Only accept image files and add size check
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
  
    // Add file size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
  
    setPhotoLoading(true);
    setError('');
  
    try {
      // Optimized compression options
      const options = {
        maxSizeMB: 0.3, // Reduce max size to 300KB
        maxWidthOrHeight: 400, // Reduce max dimensions
        useWebWorker: true,
        maxIteration: 2, // Limit compression iterations
        initialQuality: 0.8, // Start with higher quality
        fileType: 'image/jpeg' // Convert all images to JPEG
      };
  
      let compressedFile;
      try {
        compressedFile = await imageCompression(file, options);
        
        // If the compressed size is still larger than original, use the original
        if (compressedFile.size > file.size) {
          console.log('Using original file as compression did not reduce size');
          compressedFile = file;
        }
      } catch (compressionError) {
        console.error('Compression failed, using original file:', compressionError);
        compressedFile = file;
      }
  
      // Upload the file directly instead of converting to base64
      await updateProfilePhoto(compressedFile);
      setSuccess('Profile photo updated successfully');
    } catch (err) {
      console.error('Error updating profile photo:', err);
      setError('Failed to update profile photo. Please try again.');
    } finally {
      setPhotoLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <ProfileContainer>
      <ProfileSidebar>
        <ProfileAvatar>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" />
          ) : (
            getInitials()
          )}
          <AvatarOverlay onClick={handlePhotoClick}>
            <ChangePhotoText>
              {photoLoading ? 'Processing...' : 'Change Photo'}
            </ChangePhotoText>
            <RemovePhotoText
              show={currentUser.photoURL}
              onClick={handleRemovePhoto}
            >
              Remove Photo
            </RemovePhotoText>
          </AvatarOverlay>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </ProfileAvatar>
        <ProfileName>{`${currentUser.firstName} ${currentUser.lastName}`}</ProfileName>
        <ProfileEmail>{currentUser.email}</ProfileEmail>

        <SidebarNav>
          <NavItem
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </NavItem>
          <NavItem
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            Quiz History
          </NavItem>
        </SidebarNav>

        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </ProfileSidebar>

      <ProfileContent>
        {activeTab === 'profile' && (
          <>
            <ContentTitle>Profile Information</ContentTitle>
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ProfileForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip Code"
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </FormGroup>

              <SaveButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ProfileForm>
          </>
        )}
        {activeTab === 'history' && (
          <>
            <ContentTitle>Quiz History</ContentTitle>
            {renderQuizHistory()}
          </>

        )}
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;

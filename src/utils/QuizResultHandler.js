import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export class QuizResultHandler {
  constructor(user) {
    this.user = user;
  }

  /**
   * Test database connectivity and permissions
   */
  async testDatabaseAccess() {
    try {
      console.log('🧪 Testing database access...');
      
      // Test basic read access
      const testQuery = query(collection(db, 'quizHistory'));
      const snapshot = await getDocs(testQuery);
      console.log('✅ Can read quizHistory collection, total documents:', snapshot.size);
      
      // Test user-specific read access
      const userQuery = query(
        collection(db, 'quizHistory'),
        where('userId', '==', this.user.uid)
      );
      const userSnapshot = await getDocs(userQuery);
      console.log('✅ Can read user quiz history, found:', userSnapshot.size, 'documents');
      
      // Log sample data structure
      if (!userSnapshot.empty) {
        const sampleDoc = userSnapshot.docs[0];
        console.log('📋 Sample quiz history document:', {
          id: sampleDoc.id,
          data: sampleDoc.data()
        });
      }
      
      return {
        success: true,
        totalDocuments: snapshot.size,
        userDocuments: userSnapshot.size,
        canRead: true,
        message: 'Database access test successful'
      };
    } catch (error) {
      console.error('❌ Database access test failed:', error);
      return {
        success: false,
        error: error.message,
        canRead: false,
        message: 'Database access test failed'
      };
    }
  }

  /**
   * Save quiz results to Firestore with enhanced validation
   * @param {Object} quizData - The quiz result data
   */
  async saveQuizResult(quizData) {
    try {
      console.log('💾 Starting to save quiz result...');
      console.log('📊 Input quiz data:', quizData);
      console.log('👤 Current user:', {
        uid: this.user?.uid,
        email: this.user?.email,
        displayName: this.user?.displayName
      });

      // Validate required data
      if (!this.user || !this.user.uid) {
        throw new Error('User not authenticated');
      }

      if (!quizData.topicId || !quizData.topicName) {
        throw new Error('Topic information is required');
      }

      if (!quizData.totalQuestions || quizData.totalQuestions <= 0) {
        throw new Error('Total questions must be greater than 0');
      }

      if (quizData.correctAnswers < 0 || quizData.correctAnswers > quizData.totalQuestions) {
        throw new Error('Correct answers must be between 0 and total questions');
      }

      // Calculate percentage
      const percentage = Math.round(((quizData.correctAnswers || 0) / (quizData.totalQuestions || 1)) * 100);

      // Prepare quiz history document with all required fields
      const quizHistoryData = {
        // User information (required for Profile component)
        userId: this.user.uid,
        userEmail: this.user.email,
        userName: this.user.displayName || this.user.email.split('@')[0],
        userPhotoURL: this.user.photoURL || null,
        
        // Topic information (required for Profile component)
        topicId: quizData.topicId,
        topicName: quizData.topicName,
        difficulty: quizData.difficulty || 'Mixed',
        
        // Quiz results (required for Profile component)
        totalQuestions: quizData.totalQuestions,
        correctAnswers: quizData.correctAnswers,
        incorrectAnswers: quizData.totalQuestions - quizData.correctAnswers,
        percentage: percentage,
        score: quizData.correctAnswers, // Alternative field name
        
        // Time tracking
        timeSpent: quizData.timeSpent || 0,
        startTime: quizData.startTime || new Date(),
        completedAt: serverTimestamp(),
        
        // Additional data
        answers: quizData.answers || [],
        questions: quizData.questions || [],
        detailedResults: quizData.detailedResults || [],
        
        // Status flags
        isCompleted: true,
        attemptNumber: 1,
        
        // Metadata
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        version: '2.0',
        
        // Device info for debugging
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      };

      console.log('📝 Prepared quiz history data:', quizHistoryData);

      // Save to quizHistory collection
      console.log('💾 Saving to Firestore...');
      const quizHistoryRef = await addDoc(collection(db, 'quizHistory'), quizHistoryData);
      console.log('✅ Quiz history saved with ID:', quizHistoryRef.id);

      // Verify the document was saved correctly
      const savedDoc = await getDoc(quizHistoryRef);
      if (savedDoc.exists()) {
        console.log('✅ Document verification successful:', savedDoc.data());
      } else {
        console.warn('⚠️ Document verification failed - document not found');
      }

      // Test immediate read access
      console.log('🔍 Testing immediate read access...');
      const testQuery = query(
        collection(db, 'quizHistory'),
        where('userId', '==', this.user.uid)
      );
      const testSnapshot = await getDocs(testQuery);
      console.log('📊 Immediate read test result:', testSnapshot.size, 'documents found');

      // Update user statistics (non-blocking)
      try {
        await this.updateUserStats(quizData, percentage);
        console.log('📊 User stats updated successfully');
      } catch (statsError) {
        console.warn('⚠️ Failed to update user stats:', statsError.message);
      }

      // Update topic statistics (non-blocking)
      try {
        await this.updateTopicStats(quizData, percentage);
        console.log('📈 Topic stats updated successfully');
      } catch (topicError) {
        console.warn('⚠️ Failed to update topic stats:', topicError.message);
      }

      const result = {
        success: true,
        quizHistoryId: quizHistoryRef.id,
        message: 'Quiz results saved successfully',
        data: quizHistoryData,
        verification: {
          documentExists: savedDoc.exists(),
          immediateReadCount: testSnapshot.size
        }
      };

      console.log('🎉 Save operation completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Error saving quiz result:', error);
      
      // Provide specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your login status and try again.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('You are not logged in. Please log in and try again.');
      } else if (error.code === 'unavailable') {
        throw new Error('Database is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`Failed to save quiz result: ${error.message}`);
      }
    }
  }

  /**
   * Load user's quiz history for verification
   */
  async loadUserQuizHistory() {
    try {
      console.log('📚 Loading user quiz history for verification...');
      
      // Try with ordering first
      try {
        const orderedQuery = query(
          collection(db, 'quizHistory'),
          where('userId', '==', this.user.uid),
          orderBy('completedAt', 'desc')
        );
        
        const snapshot = await getDocs(orderedQuery);
        console.log('✅ Ordered query successful, found:', snapshot.size, 'documents');
        
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return { success: true, history, count: history.length };
      } catch (orderError) {
        console.log('⚠️ Ordered query failed, trying simple query:', orderError.message);
        
        // Fallback to simple query
        const simpleQuery = query(
          collection(db, 'quizHistory'),
          where('userId', '==', this.user.uid)
        );
        
        const snapshot = await getDocs(simpleQuery);
        console.log('✅ Simple query successful, found:', snapshot.size, 'documents');
        
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort manually
        history.sort((a, b) => {
          const aDate = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt);
          const bDate = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt);
          return bDate - aDate;
        });
        
        return { success: true, history, count: history.length };
      }
    } catch (error) {
      console.error('❌ Error loading quiz history:', error);
      return { success: false, error: error.message, history: [], count: 0 };
    }
  }

  /**
   * Update user statistics
   * @param {Object} quizData - The quiz result data
   * @param {number} percentage - Calculated percentage
   */
  async updateUserStats(quizData, percentage) {
    try {
      const userStatsRef = doc(db, 'userStats', this.user.uid);
      const userStatsDoc = await getDoc(userStatsRef);

      if (userStatsDoc.exists()) {
        // Update existing stats
        const currentStats = userStatsDoc.data();
        const newTotalQuizzes = (currentStats.totalQuizzes || 0) + 1;
        const newTotalScore = (currentStats.totalScore || 0) + percentage;
        const newAverageScore = Math.round(newTotalScore / newTotalQuizzes);

        await updateDoc(userStatsRef, {
          totalQuizzes: increment(1),
          totalCorrectAnswers: increment(quizData.correctAnswers || 0),
          totalQuestions: increment(quizData.totalQuestions || 0),
          totalTimeSpent: increment(quizData.timeSpent || 0),
          totalScore: increment(percentage),
          averageScore: newAverageScore,
          lastQuizDate: serverTimestamp(),
          updatedAt: serverTimestamp(),
          
          // Track best score
          bestScore: Math.max(currentStats.bestScore || 0, percentage)
        });

        console.log('📊 User stats updated');
      } else {
        // Create new stats document
        await setDoc(userStatsRef, {
          userId: this.user.uid,
          userEmail: this.user.email,
          userName: this.user.displayName || this.user.email.split('@')[0],
          
          totalQuizzes: 1,
          totalCorrectAnswers: quizData.correctAnswers || 0,
          totalQuestions: quizData.totalQuestions || 0,
          totalTimeSpent: quizData.timeSpent || 0,
          totalScore: percentage,
          averageScore: percentage,
          bestScore: percentage,
          
          firstQuizDate: serverTimestamp(),
          lastQuizDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          
          topicsAttempted: [quizData.topicId]
        });

        console.log('📊 User stats created');
      }
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
      throw error;
    }
  }

  /**
   * Update topic statistics
   * @param {Object} quizData - The quiz result data
   * @param {number} percentage - Calculated percentage
   */
  async updateTopicStats(quizData, percentage) {
    try {
      const topicStatsRef = doc(db, 'topicStats', quizData.topicId);
      const topicStatsDoc = await getDoc(topicStatsRef);

      if (topicStatsDoc.exists()) {
        // Update existing topic stats
        const currentStats = topicStatsDoc.data();
        const newTotalAttempts = (currentStats.totalAttempts || 0) + 1;
        const newTotalScore = (currentStats.totalScore || 0) + percentage;
        const newAverageScore = Math.round(newTotalScore / newTotalAttempts);

        await updateDoc(topicStatsRef, {
          totalAttempts: increment(1),
          totalScore: increment(percentage),
          averageScore: newAverageScore,
          lastAttemptDate: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log('📈 Topic stats updated');
      } else {
        // Create new topic stats
        await setDoc(topicStatsRef, {
          topicId: quizData.topicId,
          topicName: quizData.topicName,
          totalAttempts: 1,
          totalScore: percentage,
          averageScore: percentage,
          firstAttemptDate: serverTimestamp(),
          lastAttemptDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log('📈 Topic stats created');
      }
    } catch (error) {
      console.error('❌ Error updating topic stats:', error);
      throw error;
    }
  }

  /**
   * Test function to create sample quiz history with verification
   * @param {string} topicId - Topic ID
   * @param {string} topicName - Topic name
   */
  async createSampleQuizHistory(topicId, topicName) {
    try {
      console.log('🧪 Creating sample quiz history...');
      console.log('📋 Topic info:', { topicId, topicName });
      
      // Test database access first
      const accessTest = await this.testDatabaseAccess();
      if (!accessTest.success) {
        throw new Error(`Database access test failed: ${accessTest.error}`);
      }

      const sampleQuizzes = [
        {
          topicId,
          topicName,
          totalQuestions: 10,
          correctAnswers: 8,
          timeSpent: 300, // 5 minutes
          difficulty: 'Medium',
          answers: [
            { questionId: 1, selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true },
            { questionId: 2, selectedAnswer: 'B', correctAnswer: 'B', isCorrect: true },
            { questionId: 3, selectedAnswer: 'C', correctAnswer: 'A', isCorrect: false },
            { questionId: 4, selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true }
          ],
          questions: []
        },
        {
          topicId,
          topicName,
          totalQuestions: 15,
          correctAnswers: 12,
          timeSpent: 450, // 7.5 minutes
          difficulty: 'Hard',
          answers: [
            { questionId: 1, selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true },
            { questionId: 2, selectedAnswer: 'B', correctAnswer: 'B', isCorrect: true },
            { questionId: 3, selectedAnswer: 'C', correctAnswer: 'A', isCorrect: false }
          ],
          questions: []
        },
        {
          topicId,
          topicName,
          totalQuestions: 8,
          correctAnswers: 6,
          timeSpent: 240, // 4 minutes
          difficulty: 'Easy',
          answers: [
            { questionId: 1, selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true },
            { questionId: 2, selectedAnswer: 'B', correctAnswer: 'C', isCorrect: false }
          ],
          questions: []
        }
      ];

      const results = [];
      
      for (let i = 0; i < sampleQuizzes.length; i++) {
        const quiz = sampleQuizzes[i];
        console.log(`📝 Creating sample quiz ${i + 1}/${sampleQuizzes.length}...`);
        
        try {
          const result = await this.saveQuizResult(quiz);
          results.push(result);
          console.log(`✅ Sample quiz ${i + 1} created with ID:`, result.quizHistoryId);
          
          // Add delay between saves
          if (i < sampleQuizzes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error(`❌ Failed to create sample quiz ${i + 1}:`, error.message);
          throw error;
        }
      }

      // Verify all data was saved
      console.log('🔍 Verifying saved data...');
      const verificationResult = await this.loadUserQuizHistory();
      
      console.log('✅ Sample quiz history creation completed');
      console.log('📊 Verification result:', verificationResult);
      
      return { 
        success: true, 
        message: `Successfully created ${results.length} sample quiz entries`,
        results,
        verification: verificationResult
      };
      
    } catch (error) {
      console.error('❌ Error creating sample quiz history:', error);
      throw new Error(`Failed to create sample data: ${error.message}`);
    }
  }
}

// Export utility functions with enhanced error handling
export const saveQuizResult = async (user, quizData) => {
  if (!user) {
    throw new Error('User is required');
  }
  const handler = new QuizResultHandler(user);
  return await handler.saveQuizResult(quizData);
};

export const createSampleData = async (user, topicId, topicName) => {
  if (!user) {
    throw new Error('User is required');
  }
  if (!topicId || !topicName) {
    throw new Error('Topic ID and name are required');
  }
  const handler = new QuizResultHandler(user);
  return await handler.createSampleQuizHistory(topicId, topicName);
};

export const testDatabaseAccess = async (user) => {
  if (!user) {
    throw new Error('User is required');
  }
  const handler = new QuizResultHandler(user);
  return await handler.testDatabaseAccess();
};

export const loadUserQuizHistory = async (user) => {
  if (!user) {
    throw new Error('User is required');
  }
  const handler = new QuizResultHandler(user);
  return await handler.loadUserQuizHistory();
};
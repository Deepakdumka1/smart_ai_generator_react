/**
 * Utility functions for the Smart Quiz Generator
 */

/**
 * Generates an adaptive question based on the current difficulty level
 * @param {Array} questions - Array of all available questions
 * @param {String} difficulty - Current difficulty level ('easy', 'medium', 'hard')
 * @param {Array} previousQuestions - Array of previously asked questions to avoid repetition
 * @returns {Object} A question object
 */
export const generateAdaptiveQuestion = (questions, difficulty, previousQuestions) => {
  // Filter questions by difficulty
  const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  
  // Filter out previously asked questions
  const availableQuestions = filteredQuestions.filter(q => 
    !previousQuestions.some(prevQ => prevQ.id === q.id)
  );
  
  // If no questions available at the current difficulty, try adjacent difficulties
  if (availableQuestions.length === 0) {
    // Try to find questions from adjacent difficulty levels
    let alternativeDifficulty;
    
    if (difficulty === 'easy') {
      alternativeDifficulty = 'medium';
    } else if (difficulty === 'hard') {
      alternativeDifficulty = 'medium';
    } else {
      // For medium difficulty, randomly choose between easy and hard
      alternativeDifficulty = Math.random() > 0.5 ? 'easy' : 'hard';
    }
    
    const alternativeQuestions = questions.filter(q => 
      q.difficulty === alternativeDifficulty && 
      !previousQuestions.some(prevQ => prevQ.id === q.id)
    );
    
    if (alternativeQuestions.length > 0) {
      return alternativeQuestions[Math.floor(Math.random() * alternativeQuestions.length)];
    }
    
    // If still no questions, return a random question that hasn't been asked
    const remainingQuestions = questions.filter(q => 
      !previousQuestions.some(prevQ => prevQ.id === q.id)
    );
    
    if (remainingQuestions.length > 0) {
      return remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
    }
    
    // If all questions have been asked, return a random question
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  // Return a random question from the available questions
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};

/**
 * Calculates performance metrics based on quiz results
 * @param {Object} quizResults - Quiz results object
 * @returns {Object} Performance metrics
 */
export const calculatePerformanceMetrics = (quizResults) => {
  const { answers, questions } = quizResults;
  
  // Calculate overall score
  const correctAnswers = answers.filter(answer => answer.correct).length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Calculate average response time
  const totalResponseTime = answers.reduce((sum, answer) => sum + answer.responseTime, 0);
  const averageResponseTime = totalResponseTime / answers.length;
  
  // Calculate performance by difficulty
  const performanceByDifficulty = {
    easy: { correct: 0, incorrect: 0, total: 0 },
    medium: { correct: 0, incorrect: 0, total: 0 },
    hard: { correct: 0, incorrect: 0, total: 0 }
  };
  
  answers.forEach((answer, index) => {
    const question = questions[index];
    const difficulty = question.difficulty;
    
    performanceByDifficulty[difficulty].total += 1;
    
    if (answer.correct) {
      performanceByDifficulty[difficulty].correct += 1;
    } else {
      performanceByDifficulty[difficulty].incorrect += 1;
    }
  });
  
  return {
    scorePercentage,
    correctAnswers,
    totalQuestions,
    averageResponseTime,
    performanceByDifficulty
  };
};

/**
 * Generates topic recommendations based on quiz results
 * @param {Object} quizResults - Quiz results object
 * @returns {Array} Array of recommendation objects
 */
export const getTopicRecommendations = (quizResults) => {
  const { answers, questions, topicId, topicName } = quizResults;
  
  // Calculate performance metrics
  const metrics = calculatePerformanceMetrics(quizResults);
  
  // Generate recommendations based on performance
  const recommendations = [];
  
  // Recommendation based on overall score
  if (metrics.scorePercentage < 50) {
    recommendations.push({
      title: 'Review Basics',
      description: `Your score indicates you might benefit from reviewing the fundamentals of ${topicName}. Consider retaking this quiz after studying the basics.`,
      topicId: topicId
    });
  } else if (metrics.scorePercentage < 80) {
    recommendations.push({
      title: 'Practice More',
      description: `You're doing well, but more practice would help reinforce your knowledge of ${topicName}. Try focusing on the questions you got wrong.`,
      topicId: topicId
    });
  } else {
    recommendations.push({
      title: 'Challenge Yourself',
      description: `Great job! You've mastered ${topicName}. Consider trying a more challenging topic to expand your knowledge.`,
      topicId: null
    });
  }
  
  // Recommendation based on difficulty performance
  const weakestDifficulty = Object.keys(metrics.performanceByDifficulty).reduce((weakest, difficulty) => {
    const current = metrics.performanceByDifficulty[difficulty];
    const weakestPerf = metrics.performanceByDifficulty[weakest];
    
    // Skip if no questions at this difficulty
    if (current.total === 0) return weakest;
    
    // Skip if no questions at the weakest difficulty yet
    if (weakestPerf.total === 0) return difficulty;
    
    const currentRatio = current.correct / current.total;
    const weakestRatio = weakestPerf.correct / weakestPerf.total;
    
    return currentRatio < weakestRatio ? difficulty : weakest;
  }, 'easy');
  
  if (metrics.performanceByDifficulty[weakestDifficulty].total > 0) {
    const weakestRatio = metrics.performanceByDifficulty[weakestDifficulty].correct / 
                         metrics.performanceByDifficulty[weakestDifficulty].total;
    
    if (weakestRatio < 0.7) {
      recommendations.push({
        title: `Improve ${weakestDifficulty.charAt(0).toUpperCase() + weakestDifficulty.slice(1)} Questions`,
        description: `You seem to struggle with ${weakestDifficulty} difficulty questions. Focus on improving this area to boost your overall performance.`,
        topicId: topicId
      });
    }
  }
  
  // Recommendation based on response time
  if (metrics.averageResponseTime > 20) {
    recommendations.push({
      title: 'Work on Speed',
      description: 'Your average response time is quite long. Try to improve your speed by practicing more and becoming more familiar with the material.',
      topicId: null
    });
  }
  
  // If no specific recommendations, add a generic one
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Keep Learning',
      description: 'Continue exploring different topics to expand your knowledge and skills.',
      topicId: null
    });
  }
  
  return recommendations;
};

/**
 * Calculates the optimal next difficulty level using Dynamic Programming
 * @param {Array} answers - Array of previous answers
 * @param {String} currentDifficulty - Current difficulty level
 * @returns {String} Next optimal difficulty level
 */
export const calculateOptimalDifficulty = (answers, currentDifficulty) => {
  // If no previous answers, return the current difficulty
  if (!answers || answers.length === 0) {
    return currentDifficulty;
  }
  
  // Get the last few answers (up to 3) to determine trend
  const recentAnswers = answers.slice(-3);
  
  // Count correct and incorrect answers
  const correctCount = recentAnswers.filter(a => a.correct).length;
  const totalCount = recentAnswers.length;
  
  // Calculate success rate
  const successRate = correctCount / totalCount;
  
  // Determine next difficulty based on success rate
  if (successRate >= 0.7) {
    // If doing well, increase difficulty
    return getHarderDifficulty(currentDifficulty);
  } else if (successRate <= 0.3) {
    // If struggling, decrease difficulty
    return getEasierDifficulty(currentDifficulty);
  }
  
  // Otherwise, maintain current difficulty
  return currentDifficulty;
};

/**
 * Returns a harder difficulty level
 * @param {String} difficulty - Current difficulty level
 * @returns {String} Harder difficulty level
 */
const getHarderDifficulty = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'medium';
    case 'medium': return 'hard';
    case 'hard': return 'hard';
    default: return 'medium';
  }
};

/**
 * Returns an easier difficulty level
 * @param {String} difficulty - Current difficulty level
 * @returns {String} Easier difficulty level
 */
const getEasierDifficulty = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'easy';
    case 'medium': return 'easy';
    case 'hard': return 'medium';
    default: return 'easy';
  }
};

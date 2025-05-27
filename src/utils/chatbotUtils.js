import { topicsData } from '../data/topicsData';

// Bot responses
export const botResponses = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! I'm QuizBot. What can I do for you?",
    "Hey! Need help with a quiz or just want to chat?",
    "Welcome! I'm here to assist you with your quiz journey."
  ],
  farewell: [
    "Goodbye! Come back anytime.",
    "See you later! Hope you enjoyed our chat.",
    "Bye! Good luck with your quizzes!",
    "Take care! Feel free to chat again when you're back."
  ],
  quiz: [
    "Our quizzes are designed to adapt to your knowledge level. The more you answer correctly, the harder they get!",
    "Did you know? You can track your quiz history in your profile page.",
    "Try different topics to expand your knowledge base!",
    "If you're finding quizzes too difficult, don't worry! Practice makes perfect."
  ],
  help: [
    "You can browse topics from the Topics page, take quizzes, and track your progress in your profile.",
    "Need help with a specific feature? Just ask me!",
    "If you're looking for study resources, I can suggest some based on your quiz history.",
    "Don't forget to update your profile with a photo to personalize your experience!"
  ],
  unknown: [
    "I'm not sure I understand. Could you rephrase that?",
    "Hmm, I'm still learning. Can you try asking in a different way?",
    "I didn't quite catch that. What would you like to know about?",
    "I'm sorry, I don't have information on that yet. Is there something else I can help with?"
  ],
  joke: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call a fake noodle? An impasta!"
  ],
  motivation: [
    "You're doing great! Keep pushing forward with your learning journey.",
    "Remember, every expert was once a beginner. Keep practicing!",
    "The more you learn, the more you grow. You're on the right path!",
    "Success comes from persistence. Keep taking those quizzes!"
  ],
  suggestion: [
    "Based on your quiz history, I think you might enjoy trying a quiz on {topic}.",
    "Have you considered taking a quiz on {topic}? It might be interesting for you!",
    "Looking for a new challenge? Why not try a quiz on {topic}?",
    "I noticed you haven't tried {topic} yet. Would you like to give it a go?"
  ],
  bored: [
    "Feeling bored? Let me suggest a quiz to keep your mind active!",
    "Boredom is the perfect opportunity to learn something new. How about a quiz?",
    "I can help cure your boredom! Would you like a quiz suggestion or maybe a joke?",
    "When you're bored, it's the perfect time to challenge yourself with a new quiz topic!"
  ],
  profile: [
    "You can update your profile information and photo in the profile page.",
    "Your quiz history is saved in your profile. It's a great way to track your progress!",
    "Don't forget to complete your profile information to personalize your experience.",
    "Your profile helps us provide better quiz recommendations based on your interests and performance."
  ]
};

export const getRandomResponse = (category) => {
  const responses = botResponses[category] || botResponses.unknown;
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getPersonalizedResponse = (category, currentUser) => {
  const responses = botResponses[category] || botResponses.unknown;
  let response = responses[Math.floor(Math.random() * responses.length)];
  if (currentUser) {
    response = response.replace('{name}', currentUser.firstName || 'there');
    if (category === 'suggestion' || category === 'bored') {
      const suggestedTopic = getSuggestedTopic(currentUser);
      response = response.replace('{topic}', suggestedTopic.name);
      response = {
        text: response,
        topicId: suggestedTopic.id,
        showQuizButton: true
      };
    }
  }
  return response;
};

export const getSuggestedTopic = (currentUser) => {
  if (!currentUser || !currentUser.quizHistory || currentUser.quizHistory.length === 0) {
    return topicsData[Math.floor(Math.random() * topicsData.length)];
  }
  const triedTopicIds = currentUser.quizHistory.map(quiz => quiz.topicId);
  const untried = topicsData.filter(topic => !triedTopicIds.includes(topic.id));
  if (untried.length > 0) {
    return untried[Math.floor(Math.random() * untried.length)];
  }
  const topicPerformance = {};
  currentUser.quizHistory.forEach(quiz => {
    if (!quiz.answers) return;
    const correctAnswers = quiz.answers.filter(a => a.correct).length;
    const score = correctAnswers / quiz.totalQuestions;
    if (!topicPerformance[quiz.topicId]) {
      topicPerformance[quiz.topicId] = { totalScore: 0, count: 0 };
    }
    topicPerformance[quiz.topicId].totalScore += score;
    topicPerformance[quiz.topicId].count += 1;
  });
  const topicScores = Object.keys(topicPerformance).map(topicId => ({
    topicId,
    averageScore: topicPerformance[topicId].totalScore / topicPerformance[topicId].count
  }));
  topicScores.sort((a, b) => a.averageScore - b.averageScore);
  const lowestScoreTopic = topicsData.find(topic =>
    topicScores.length > 0 && topic.id === topicScores[0].topicId
  );
  return lowestScoreTopic || topicsData[Math.floor(Math.random() * topicsData.length)];
};

// Simple keyword-based analyzeMessage implementation
export const analyzeMessage = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return 'greetings';
  if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) return 'farewell';
  if (lower.includes('help') || lower.includes('how') || lower.includes('can you')) return 'help';
  if (lower.includes('quiz') || lower.includes('question')) return 'quiz';
  if (lower.includes('joke')) return 'joke';
  if (lower.includes('motivat')) return 'motivation';
  if (lower.includes('suggest') || lower.includes('recommend')) return 'suggestion';
  if (lower.includes('bored')) return 'bored';
  if (lower.includes('profile') || lower.includes('account')) return 'profile';
  return 'unknown';
}; 
// Migration script to upload questions to Firebase
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Topics data that corresponds to your questions
const topicsData = [
  {
    id: 'math-basics',
    name: 'Math Basics',
    description: 'Fundamental mathematics concepts including algebra, geometry, and calculus',
    icon: '🔢',
    color: '#4361ee'
  },
  {
    id: 'world-history',
    name: 'World History',
    description: 'Major historical events, civilizations, and important figures throughout history',
    icon: '🏛️',
    color: '#f72585'
  },
  {
    id: 'general-science',
    name: 'General Science',
    description: 'Basic concepts in physics, chemistry, biology, and earth science',
    icon: '🔬',
    color: '#4cc9f0'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Programming concepts, algorithms, data structures, and computer systems',
    icon: '💻',
    color: '#7209b7'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'JavaScript programming language fundamentals and advanced concepts',
    icon: '⚡',
    color: '#f39c12'
  }
];

// Sample questions data - you can replace this with your actual questions
const questionsData = [
  // Math Basics Questions
  {
    id: 'math-1',
    topicId: 'math-basics',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Basic addition: 2 + 2 = 4'
  },
  {
    id: 'math-2',
    topicId: 'math-basics',
    text: 'What is the square root of 16?',
    options: ['2', '3', '4', '5'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The square root of 16 is 4 because 4 × 4 = 16'
  },
  {
    id: 'math-3',
    topicId: 'math-basics',
    text: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '15% of 200 = 0.15 × 200 = 30'
  },
  {
    id: 'math-4',
    topicId: 'math-basics',
    text: 'Solve for x: 2x + 5 = 15',
    options: ['3', '5', '7', '10'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5'
  },
  {
    id: 'math-5',
    topicId: 'math-basics',
    text: 'What is the area of a circle with radius 3?',
    options: ['6π', '9π', '12π', '18π'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Area = πr² = π × 3² = 9π'
  },
  
  // World History Questions
  {
    id: 'history-1',
    topicId: 'world-history',
    text: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'World War II ended in 1945 with the surrender of Japan'
  },
  {
    id: 'history-2',
    topicId: 'world-history',
    text: 'Who was the first President of the United States?',
    options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'George Washington was the first President of the United States (1789-1797)'
  },
  {
    id: 'history-3',
    topicId: 'world-history',
    text: 'Which empire was ruled by Julius Caesar?',
    options: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Egyptian Empire'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Julius Caesar was a Roman general and statesman who ruled the Roman Empire'
  },
  {
    id: 'history-4',
    topicId: 'world-history',
    text: 'The French Revolution began in which year?',
    options: ['1789', '1799', '1804', '1815'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The French Revolution began in 1789 with the storming of the Bastille'
  },
  {
    id: 'history-5',
    topicId: 'world-history',
    text: 'Who was known as the "Iron Lady"?',
    options: ['Queen Elizabeth II', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Margaret Thatcher, former British Prime Minister, was known as the "Iron Lady"'
  },
  
  // General Science Questions
  {
    id: 'science-1',
    topicId: 'general-science',
    text: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom: H2O'
  },
  {
    id: 'science-2',
    topicId: 'general-science',
    text: 'How many bones are in the adult human body?',
    options: ['196', '206', '216', '226'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'An adult human body has 206 bones'
  },
  {
    id: 'science-3',
    topicId: 'general-science',
    text: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Mars is known as the Red Planet due to its reddish appearance'
  },
  {
    id: 'science-4',
    topicId: 'general-science',
    text: 'What is the speed of light in vacuum?',
    options: ['299,792,458 m/s', '300,000,000 m/s', '186,000 miles/s', 'All of the above'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'The speed of light is approximately 299,792,458 m/s or 300,000 km/s or 186,000 miles/s'
  },
  {
    id: 'science-5',
    topicId: 'general-science',
    text: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Mitochondria are known as the powerhouse of the cell because they produce ATP energy'
  },
  
  // Computer Science Questions
  {
    id: 'cs-1',
    topicId: 'computer-science',
    text: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'HTML stands for Hyper Text Markup Language'
  },
  {
    id: 'cs-2',
    topicId: 'computer-science',
    text: 'Which of the following is a programming language?',
    options: ['HTTP', 'HTML', 'JavaScript', 'CSS'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'JavaScript is a programming language, while the others are protocols or markup languages'
  },
  {
    id: 'cs-3',
    topicId: 'computer-science',
    text: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'CPU stands for Central Processing Unit'
  },
  {
    id: 'cs-4',
    topicId: 'computer-science',
    text: 'Which data structure uses LIFO (Last In, First Out)?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed'
  },
  {
    id: 'cs-5',
    topicId: 'computer-science',
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each time'
  },

  // JavaScript Questions
  {
    id: 'js-1',
    topicId: 'javascript',
    text: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'push() method adds one or more elements to the end of an array'
  },
  {
    id: 'js-2',
    topicId: 'javascript',
    text: 'What is the correct way to declare a variable in JavaScript?',
    options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'All of the above'],
    correctOption: 3,
    difficulty: 'easy',
    explanation: 'All three (var, let, const) are valid ways to declare variables in JavaScript'
  },
  {
    id: 'js-3',
    topicId: 'javascript',
    text: 'What does "=== " operator do in JavaScript?',
    options: ['Assignment', 'Equality without type checking', 'Strict equality with type checking', 'Not equal'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: '=== is the strict equality operator that checks both value and type'
  },
  {
    id: 'js-4',
    topicId: 'javascript',
    text: 'Which method is used to convert JSON string to JavaScript object?',
    options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.object()'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'JSON.parse() converts a JSON string into a JavaScript object'
  },
  {
    id: 'js-5',
    topicId: 'javascript',
    text: 'What is a closure in JavaScript?',
    options: ['A way to close the browser', 'A function that has access to outer scope', 'A method to end loops', 'A type of variable'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned'
  }
];

// Function to migrate topics to Firebase
export const migrateTopicsToFirebase = async () => {
  try {
    console.log('Starting topics migration...');
    
    for (const topic of topicsData) {
      // Check if topic already exists
      const topicQuery = query(collection(db, 'topics'), where('id', '==', topic.id));
      const existingTopics = await getDocs(topicQuery);
      
      if (existingTopics.empty) {
        // Add topic to Firebase
        await addDoc(collection(db, 'topics'), {
          ...topic,
          createdAt: new Date(),
          questionCount: questionsData.filter(q => q.topicId === topic.id).length
        });
        console.log(`✅ Added topic: ${topic.name}`);
      } else {
        console.log(`⚠️ Topic already exists: ${topic.name}`);
      }
    }
    
    console.log('Topics migration completed!');
  } catch (error) {
    console.error('Error migrating topics:', error);
    throw error;
  }
};

// Function to migrate questions to Firebase
export const migrateQuestionsToFirebase = async () => {
  try {
    console.log('Starting questions migration...');
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const question of questionsData) {
      // Check if question already exists
      const questionQuery = query(collection(db, 'questions'), where('id', '==', question.id));
      const existingQuestions = await getDocs(questionQuery);
      
      if (existingQuestions.empty) {
        // Transform the question data to match Firebase structure
        const firebaseQuestion = {
          id: question.id,
          topicId: question.topicId,
          question: question.text, // Map 'text' to 'question'
          options: question.options,
          correctAnswer: question.correctOption, // Map 'correctOption' to 'correctAnswer'
          difficulty: question.difficulty,
          explanation: question.explanation,
          createdAt: new Date(),
          isActive: true
        };
        
        // Add question to Firebase
        await addDoc(collection(db, 'questions'), firebaseQuestion);
        addedCount++;
        console.log(`✅ Added question: ${question.id}`);
      } else {
        skippedCount++;
        console.log(`⚠️ Question already exists: ${question.id}`);
      }
    }
    
    console.log(`Questions migration completed! Added: ${addedCount}, Skipped: ${skippedCount}`);
    return { addedCount, skippedCount };
  } catch (error) {
    console.error('Error migrating questions:', error);
    throw error;
  }
};

// Function to run complete migration
export const runCompleteMigration = async () => {
  console.log('🚀 Starting complete migration to Firebase...');
  
  try {
    // First migrate topics
    await migrateTopicsToFirebase();
    
    // Then migrate questions
    const questionResult = await migrateQuestionsToFirebase();
    
    console.log('🎉 Complete migration finished successfully!');
    
    // Display summary
    const topicsSnapshot = await getDocs(collection(db, 'topics'));
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    
    console.log(`📊 Migration Summary:`);
    console.log(`   Topics in Firebase: ${topicsSnapshot.size}`);
    console.log(`   Questions in Firebase: ${questionsSnapshot.size}`);
    console.log(`   Questions added this session: ${questionResult.addedCount}`);
    console.log(`   Questions skipped (already exist): ${questionResult.skippedCount}`);
    
    return {
      success: true,
      topicsCount: topicsSnapshot.size,
      questionsCount: questionsSnapshot.size,
      addedCount: questionResult.addedCount,
      skippedCount: questionResult.skippedCount
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get questions by topic from Firebase
export const getQuestionsByTopic = async (topicId, difficulty = null, limit = null) => {
  try {
    let q = query(
      collection(db, 'questions'),
      where('topicId', '==', topicId),
      where('isActive', '==', true)
    );
    
    // Add difficulty filter if specified
    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }
    
    const querySnapshot = await getDocs(q);
    let questions = querySnapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
    
    // Shuffle questions for randomness
    questions = questions.sort(() => Math.random() - 0.5);
    
    // Limit number of questions if specified
    if (limit) {
      questions = questions.slice(0, limit);
    }
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions from Firebase:', error);
    return [];
  }
};

// Function to get all topics from Firebase
export const getTopicsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'topics'));
    const topics = querySnapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
    
    // Sort topics by name
    topics.sort((a, b) => a.name.localeCompare(b.name));
    
    return topics;
  } catch (error) {
    console.error('Error fetching topics from Firebase:', error);
    return [];
  }
};

// Function to get topic by ID from Firebase
export const getTopicById = async (topicId) => {
  try {
    const q = query(collection(db, 'topics'), where('id', '==', topicId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        firebaseId: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching topic by ID:', error);
    return null;
  }
};

// Function to get random questions for quiz
export const getRandomQuestionsForQuiz = async (topicId, count = 10, difficulty = null) => {
  try {
    const questions = await getQuestionsByTopic(topicId, difficulty);
    
    // Shuffle and limit to requested count
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error('Error getting random questions for quiz:', error);
    return [];
  }
};
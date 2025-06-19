import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const fetchCustomQuestions = async (topicId) => {
  try {
    const q = query(
      collection(db, 'customQuestions'),
      where('topicId', '==', topicId)
    );
    
    const querySnapshot = await getDocs(q);
    const customQuestions = [];
    
    querySnapshot.forEach((doc) => {
      customQuestions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return customQuestions;
  } catch (error) {
    console.error('Error fetching custom questions:', error);
    return [];
  }
};

export const combineQuestions = (staticQuestions, customQuestions) => {
  // Combine static questions with custom questions
  const combined = [...staticQuestions, ...customQuestions];
  
  // Remove duplicates based on question text (in case there are any)
  const unique = combined.filter((question, index, self) => 
    index === self.findIndex(q => q.text === question.text)
  );
  
  return unique;
};
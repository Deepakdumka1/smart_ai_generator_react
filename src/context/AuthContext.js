import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from '../config/firebase';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  arrayUnion 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Register a new user
  const signup = async (userData) => {
    const { email, password, confirmPassword, ...profileData } = userData;
    
    // Create authentication account
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Store additional user data in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      ...profileData,
      email,
      quizHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Get the complete user profile
    const userDoc = await getDoc(userDocRef);
    setCurrentUser({ ...user, ...userDoc.data() });
    
    return { ...user, ...userDoc.data() };
  };

  // Login existing user
  const login = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    setCurrentUser({ ...user, ...userDoc.data() });
    return { ...user, ...userDoc.data() };
  };

  // Logout user
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    if (!currentUser?.uid) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', currentUser.uid);
    const updateData = {
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userRef, updateData);
    
    // Get updated profile
    const userDoc = await getDoc(userRef);
    const updatedUser = { ...currentUser, ...userDoc.data() };
    setCurrentUser(updatedUser);
    
    return updatedUser;
  };

  // Add quiz result to user history
  const addQuizToHistory = async (quizResult) => {
    if (!currentUser?.uid) throw new Error('No authenticated user');
  
    try {
      // Create a new document in the quizHistory collection
      const quizHistoryRef = doc(collection(db, 'quizHistory'));
      const quizData = {
        ...quizResult,
        userId: currentUser.uid,
        completedAt: new Date().toISOString(),
        quizId: quizHistoryRef.id // Add the document ID as quizId
      };
  
      // Save the quiz result
      await setDoc(quizHistoryRef, quizData);
  
      // Also update the user's quiz history array with a reference
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        quizHistory: arrayUnion({
          quizId: quizHistoryRef.id,
          topicId: quizResult.topicId,
          score: quizResult.scorePercentage,
          completedAt: quizData.completedAt
        }),
        updatedAt: new Date().toISOString()
      });
  
      // Get updated user profile
      const userDoc = await getDoc(userRef);
      const updatedUser = { ...currentUser, ...userDoc.data() };
      setCurrentUser(updatedUser);
      
      return { quizId: quizHistoryRef.id };
    } catch (error) {
      console.error('Error saving quiz results:', error);
      throw new Error('Failed to save quiz results');
    }
  };
  const updateProfilePhoto = async (file) => {
    if (!currentUser?.uid) throw new Error('No authenticated user');
  
    try {
      let photoURL = null;
  
      if (file) {
        // Create storage reference with file metadata
        const metadata = {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000' // Cache for 1 year
        };
  
        // Create storage reference with a timestamp to prevent caching issues
        const timestamp = Date.now();
        const storageRef = ref(
          storage, 
          `profile-photos/${currentUser.uid}_${timestamp}`
        );
  
        // If there's an existing photo, delete it in the background
        if (currentUser.photoURL) {
          try {
            const oldPhotoUrl = new URL(currentUser.photoURL);
            const oldPhotoPath = decodeURIComponent(oldPhotoUrl.pathname.split('/o/')[1].split('?')[0]);
            const oldPhotoRef = ref(storage, oldPhotoPath);
            deleteObject(oldPhotoRef).catch(error => {
              console.error("Error deleting old photo:", error);
            });
          } catch (error) {
            console.error("Error parsing old photo URL:", error);
          }
        }
  
        // Upload new photo with metadata
        await uploadBytes(storageRef, file, metadata);
        
        // Get download URL with cache-busting query parameter
        photoURL = await getDownloadURL(storageRef);
        photoURL = `${photoURL}?t=${timestamp}`;
      }
  
      // Update user document with new photo URL
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        photoURL: photoURL,
        updatedAt: new Date().toISOString()
      };
  
      await updateDoc(userRef, updateData);
  
      // Get updated profile
      const userDoc = await getDoc(userRef);
      const updatedUser = { ...currentUser, ...userDoc.data() };
      setCurrentUser(updatedUser);
  
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw new Error('Failed to update profile photo');
    }
  };
  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    updateProfilePhoto,
    addQuizToHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  writeBatch 
} from 'firebase/firestore';
import './MigrationComponent.css';

const MigrationComponent = () => {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runMigration = async (migrationType) => {
    setIsRunning(true);
    setProgress(0);
    setMigrationStatus(`Starting ${migrationType} migration...`);

    try {
      switch (migrationType) {
        case 'addTimestamps':
          await addTimestampsToQuestions();
          break;
        case 'updateUserProfiles':
          await updateUserProfiles();
          break;
        case 'cleanupData':
          await cleanupOldData();
          break;
        default:
          throw new Error('Unknown migration type');
      }
      
      setMigrationStatus('Migration completed successfully!');
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus(`Migration failed: ${error.message}`);
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  const addTimestampsToQuestions = async () => {
    setMigrationStatus('Adding timestamps to questions...');
    
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);
    const batch = writeBatch(db);
    
    let processed = 0;
    const total = snapshot.docs.length;
    
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (!data.createdAt) {
        batch.update(docSnapshot.ref, {
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      processed++;
      setProgress((processed / total) * 100);
    });
    
    await batch.commit();
    setMigrationStatus(`Updated ${processed} questions with timestamps`);
  };

  const updateUserProfiles = async () => {
    setMigrationStatus('Updating user profiles...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const batch = writeBatch(db);
    
    let processed = 0;
    const total = snapshot.docs.length;
    
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const updates = {};
      
      // Add default profile fields if missing
      if (!data.profileCompleted) {
        updates.profileCompleted = false;
      }
      if (!data.preferences) {
        updates.preferences = {
          emailNotifications: true,
          theme: 'light'
        };
      }
      
      if (Object.keys(updates).length > 0) {
        batch.update(docSnapshot.ref, updates);
      }
      
      processed++;
      setProgress((processed / total) * 100);
    });
    
    await batch.commit();
    setMigrationStatus(`Updated ${processed} user profiles`);
  };

  const cleanupOldData = async () => {
    setMigrationStatus('Cleaning up old data...');
    
    // Example: Remove old quiz attempts older than 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const quizHistoryRef = collection(db, 'quizHistory');
    const snapshot = await getDocs(quizHistoryRef);
    const batch = writeBatch(db);
    
    let processed = 0;
    let deleted = 0;
    const total = snapshot.docs.length;
    
    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const createdAt = data.createdAt?.toDate();
      
      if (createdAt && createdAt < sixMonthsAgo) {
        batch.delete(docSnapshot.ref);
        deleted++;
      }
      
      processed++;
      setProgress((processed / total) * 100);
    });
    
    await batch.commit();
    setMigrationStatus(`Cleaned up ${deleted} old quiz attempts`);
  };

  return (
    <div className="migration-component">
      <div className="migration-section">
        <h3>Available Migrations</h3>
        <p>Select a migration to run. <strong>Warning:</strong> Always backup your data before running migrations.</p>
        
        <div className="migration-options">
          <div className="migration-card">
            <h4>Add Timestamps</h4>
            <p>Add createdAt and updatedAt timestamps to questions that don't have them.</p>
            <button 
              onClick={() => runMigration('addTimestamps')}
              disabled={isRunning}
              className="migration-btn primary"
            >
              Run Migration
            </button>
          </div>
          
          <div className="migration-card">
            <h4>Update User Profiles</h4>
            <p>Add missing default fields to user profiles.</p>
            <button 
              onClick={() => runMigration('updateUserProfiles')}
              disabled={isRunning}
              className="migration-btn secondary"
            >
              Run Migration
            </button>
          </div>
          
          <div className="migration-card">
            <h4>Cleanup Old Data</h4>
            <p>Remove quiz attempts older than 6 months to free up storage.</p>
            <button 
              onClick={() => runMigration('cleanupData')}
              disabled={isRunning}
              className="migration-btn danger"
            >
              Run Migration
            </button>
          </div>
        </div>
      </div>
      
      {(migrationStatus || isRunning) && (
        <div className="migration-status">
          <h4>Migration Status</h4>
          <div className="status-content">
            <p>{migrationStatus}</p>
            {isRunning && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {isRunning && <p>Progress: {Math.round(progress)}%</p>}
          </div>
        </div>
      )}
      
      <div className="migration-warning">
        <h4>⚠️ Important Notes</h4>
        <ul>
          <li>Always backup your database before running migrations</li>
          <li>Migrations cannot be undone automatically</li>
          <li>Large datasets may take several minutes to process</li>
          <li>Do not close this page while a migration is running</li>
        </ul>
      </div>
    </div>
  );
};

export default MigrationComponent;
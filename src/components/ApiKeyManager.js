import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const ApiKeyContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ApiKeyTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #343a40;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ApiKeyForm = styled.form`
  display: flex;
  gap: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ApiKeyInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 8px 10px;
  }
`;

const ApiKeyButton = styled.button`
  padding: 10px 15px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a56d4;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const ApiKeyStatus = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: ${props => props.isValid ? '#2b8a3e' : '#e03131'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ApiKeyInfo = styled.p`
  margin-top: 15px;
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
`;

const ApiKeyManager = ({ onApiKeyChange }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Load API key from user profile if available
  useEffect(() => {
    if (currentUser && currentUser.openaiApiKey) {
      setApiKey(currentUser.openaiApiKey);
      setIsKeyValid(true);
      if (onApiKeyChange) {
        onApiKeyChange(currentUser.openaiApiKey);
      }
    }
  }, [currentUser, onApiKeyChange]);
  
  const validateApiKey = async (key) => {
    // Simple validation - check if it starts with "sk-" and has sufficient length
    // In a real app, you might want to make a test API call to validate
    return key.startsWith('sk-') && key.length > 20;
  };
  
  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        // Save API key to user profile
        await updateUserProfile({ openaiApiKey: apiKey });
        setIsKeyValid(true);
        setMessage('API key saved successfully!');
        
        if (onApiKeyChange) {
          onApiKeyChange(apiKey);
        }
      } else {
        setIsKeyValid(false);
        setMessage('Invalid API key format. Please check and try again.');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage('Error saving API key. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <ApiKeyContainer>
      <ApiKeyTitle>OpenAI API Key</ApiKeyTitle>
      <ApiKeyForm onSubmit={handleSaveApiKey}>
        <ApiKeyInput
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <ApiKeyButton type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Key'}
        </ApiKeyButton>
      </ApiKeyForm>
      
      {message && (
        <ApiKeyStatus isValid={isKeyValid}>
          <span>{isKeyValid ? '✓' : '✗'}</span>
          <span>{message}</span>
        </ApiKeyStatus>
      )}
      
      <ApiKeyInfo>
        Your API key is required to use AI-powered features. It will be stored securely in your profile.
        You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI's website</a>.
      </ApiKeyInfo>
    </ApiKeyContainer>
  );
};

export default ApiKeyManager;
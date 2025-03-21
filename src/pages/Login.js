
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Styled Components
const LoginContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 25px;
  color: #3a56d4;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const LoginButton = styled.button`
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

const ErrorMessage = styled.div`
  color: #ef476f;
  background-color: rgba(239, 71, 111, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 25px;
  color: #6c757d;
  
  a {
    color: #4361ee;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Attempt to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user data exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        setError('User profile not found in database. Please contact support.');
        await auth.signOut();
        return;
      }

      // Successful login
      navigate('/');
      
    } catch (error) {
      let errorMessage = 'Failed to log in';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginTitle>Welcome Back</LoginTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <LoginForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormGroup>
        
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </LoginButton>
      </LoginForm>
      
      <SignupLink>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </SignupLink>
    </LoginContainer>
  );
};

export default Login;

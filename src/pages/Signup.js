import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const SignupContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const SignupTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 25px;
  color: #3a56d4;
  text-align: center;
`;

const SignupForm = styled.form`
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

const SignupButton = styled.button`
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

const LoginLink = styled.div`
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

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Remove confirmPassword before saving
      const { confirmPassword, ...userData } = formData;
      
      await signup(userData);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SignupContainer>
      <SignupTitle>Create an Account</SignupTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <SignupForm onSubmit={handleSubmit}>
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
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              type="password" 
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </FormGroup>
        </FormRow>
        
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
        
        <SignupButton type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </SignupButton>
      </SignupForm>
      
      <LoginLink>
        Already have an account? <Link to="/login">Log in</Link>
      </LoginLink>
    </SignupContainer>
  );
};

export default Signup;

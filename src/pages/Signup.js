import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import '../styles/responsive.css';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

// Container with responsive adjustments
const SignupContainer = styled.div`
  max-width: 950px;
  margin: 30px auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 25px 20px;
    border-radius: 10px;
    width: 90%;
  }
  
  @media (max-width: 576px) {
    margin: 15px auto;
    padding: 20px 15px;
    border-radius: 8px;
    width: 95%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const SignupTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 25px;
  color: #3a56d4;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 576px) {
    gap: 15px;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
  
  @media (max-width: 576px) {
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  
  @media (max-width: 576px) {
    gap: 6px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
  
  ${props => props.required && `
    &::after {
      content: '*';
      color: #ef476f;
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${props => props.error ? '#ef476f' : '#e9ecef'};
  font-size: 1rem;
  transition: all 0.3s;
  background-color: ${props => props.error ? 'rgba(239, 71, 111, 0.05)' : 'white'};
  
  &:focus {
    border-color: #4361ee;
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
    padding: 10px;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${props => props.error ? '#ef476f' : '#e9ecef'};
  font-size: 1rem;
  transition: all 0.3s;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;
  
  &:focus {
    border-color: #4361ee;
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
    padding: 10px;
    background-position: right 10px center;
  }
`;

const SignupButton = styled.button`
  background-color: #4361ee;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #3a56d4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
    padding: 12px;
    margin-top: 8px;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ef476f;
  background-color: rgba(239, 71, 111, 0.1);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.95rem;
  border-left: 4px solid #ef476f;
  animation: ${shake} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    padding: 8px 10px;
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
`;

const FieldError = styled.div`
  color: #ef476f;
  font-size: 0.8rem;
  margin-top: 4px;
  
  @media (max-width: 576px) {
    font-size: 0.75rem;
  }
`;

const PasswordStrengthMeter = styled.div`
  height: 5px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
`;

const PasswordStrengthIndicator = styled.div`
  height: 100%;
  width: ${props => props.strength}%;
  background-color: ${props => {
    if (props.strength < 33) return '#ef476f';
    if (props.strength < 66) return '#ffd60a';
    return '#38b000';
  }};
  border-radius: 5px;
  transition: width 0.3s, background-color 0.3s;
`;

const StrengthText = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 25px;
  color: #6c757d;
  
  @media (max-width: 576px) {
    margin-top: 20px;
    font-size: 0.9rem;
  }
  
  a {
    color: #4361ee;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover {
      color: #3a56d4;
      text-decoration: underline;
    }
  }
`;

const FormSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  margin-top: 10px;
  
  @media (max-width: 576px) {
    padding-top: 15px;
    margin-top: 5px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #495057;
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const OptionalText = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: normal;
  margin-left: 5px;
  
  @media (max-width: 576px) {
    font-size: 0.75rem;
  }
`;

// US states array for dropdown
const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

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

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touchedFields, setTouchedFields] = useState({});

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track redirect path if user was redirected to signup
  const redirectPath = location.state?.from || '/';

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (formData.password.length >= 8) strength += 25;

    // Character variety checks
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;

    setPasswordStrength(strength);
  }, [formData.password]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? 'This field is required' : '';

      case 'email':
        return value.trim() === ''
          ? 'Email is required'
          : !/\S+@\S+\.\S+/.test(value)
            ? 'Email is invalid'
            : '';

      case 'password':
        return value.trim() === ''
          ? 'Password is required'
          : value.length < 6
            ? 'Password must be at least 6 characters'
            : '';

      case 'confirmPassword':
        return value !== formData.password
          ? 'Passwords do not match'
          : '';

      case 'zipCode':
        return value && !/^\d{6}$/.test(value)
          ? 'Invalid PIN code format (6 digits required)'
          : '';

      case 'phone':
        return value && !/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
          ? 'Invalid phone number format'
          : '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate each field
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Live validation after field has been touched
    if (touchedFields[id]) {
      const error = validateField(id, value);
      setFormErrors(prev => ({
        ...prev,
        [id]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;

    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [id]: true
    }));

    // Validate on blur
    const error = validateField(id, value);
    setFormErrors(prev => ({
      ...prev,
      [id]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Set all fields as touched to show all errors
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});

      setTouchedFields(allTouched);
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Remove confirmPassword before saving
      const { confirmPassword, ...userData } = formData;

      await signup(userData);
      navigate(redirectPath);
    } catch (error) {
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'This email is already in use. Please try another or login.'
          : error.message || 'Failed to create account.'
      );

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer className="fade-in">
      <SignupTitle>Create an Account</SignupTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SignupForm onSubmit={handleSubmit} noValidate>
        {/* Basic Information */}
        <FormRow>
          <FormGroup>
            <Label htmlFor="firstName" required>First Name</Label>
            <Input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your first name"
              error={touchedFields.firstName && formErrors.firstName}
              disabled={loading}
              aria-required="true"
            />
            {touchedFields.firstName && formErrors.firstName && (
              <FieldError>{formErrors.firstName}</FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="lastName" required>Last Name</Label>
            <Input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your last name"
              error={touchedFields.lastName && formErrors.lastName}
              disabled={loading}
              aria-required="true"
            />
            {touchedFields.lastName && formErrors.lastName && (
              <FieldError>{formErrors.lastName}</FieldError>
            )}
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="email" required>Email</Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            error={touchedFields.email && formErrors.email}
            disabled={loading}
            aria-required="true"
            autoComplete="email"
          />
          {touchedFields.email && formErrors.email && (
            <FieldError>{formErrors.email}</FieldError>
          )}
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="password" required>Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
              error={touchedFields.password && formErrors.password}
              disabled={loading}
              aria-required="true"
              autoComplete="new-password"
            />

            {/* Password strength meter */}
            {formData.password && (
              <>
                <PasswordStrengthMeter>
                  <PasswordStrengthIndicator strength={passwordStrength} />
                </PasswordStrengthMeter>
                <StrengthText>
                  <span>Weak</span>
                  <span>Strong</span>
                </StrengthText>
              </>
            )}

            {touchedFields.password && formErrors.password && (
              <FieldError>{formErrors.password}</FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword" required>Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              error={touchedFields.confirmPassword && formErrors.confirmPassword}
              disabled={loading}
              aria-required="true"
              autoComplete="new-password"
            />
            {touchedFields.confirmPassword && formErrors.confirmPassword && (
              <FieldError>{formErrors.confirmPassword}</FieldError>
            )}
          </FormGroup>
        </FormRow>

        {/* Optional Contact Information */}
        <FormSection>
          <SectionTitle>Contact Information <OptionalText>(Optional)</OptionalText></SectionTitle>

          <FormGroup>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your address"
              disabled={loading}
              autoComplete="street-address"
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
                onBlur={handleBlur}
                placeholder="City"
                disabled={loading}
                autoComplete="address-level2"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Select
                id="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="address-level1"
              >
                <option value="">Select a state</option>
                {INDIA_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Zip Code"
                error={touchedFields.zipCode && formErrors.zipCode}
                disabled={loading}
                autoComplete="postal-code"
              />
              {touchedFields.zipCode && formErrors.zipCode && (
                <FieldError>{formErrors.zipCode}</FieldError>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              error={touchedFields.phone && formErrors.phone}
              disabled={loading}
              autoComplete="tel"
            />
            {touchedFields.phone && formErrors.phone && (
              <FieldError>{formErrors.phone}</FieldError>
            )}
          </FormGroup>
        </FormSection>

        <SignupButton type="submit" disabled={loading} className="touch-friendly-spacing">
          <ButtonContent>
            {loading && <Spinner />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </ButtonContent>
        </SignupButton>
      </SignupForm>

      <LoginLink>
        Already have an account? <Link to="/login">Log in</Link>
      </LoginLink>
    </SignupContainer>
  );
};

export default Signup;

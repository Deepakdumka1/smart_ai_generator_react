import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { topicsData } from '../../data/topicsData';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
`;

const Form = styled.form`
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
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RadioInput = styled.input`
  margin: 0;
`;

const OptionInput = styled(Input)`
  flex: 1;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
`;

const AddQuestionForm = () => {
  const [formData, setFormData] = useState({
    topicId: '',
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    difficulty: 'easy',
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectOptionChange = (index) => {
    setFormData(prev => ({
      ...prev,
      correctOption: index
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate form
      if (!formData.topicId || !formData.text || formData.options.some(opt => !opt.trim()) || !formData.explanation) {
        throw new Error('Please fill in all fields');
      }

      // Create question data
      const questionData = {
        ...formData,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      };

      // Save to Firebase
      await addDoc(collection(db, 'customQuestions'), questionData);

      setMessage({ type: 'success', text: 'Question added successfully!' });
      
      // Reset form
      setFormData({
        topicId: '',
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        difficulty: 'easy',
        explanation: ''
      });

    } catch (error) {
      console.error('Error adding question:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to add question' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Add New Question</FormTitle>
      
      {message.text && (
        message.type === 'success' ? 
          <SuccessMessage>{message.text}</SuccessMessage> :
          <ErrorMessage>{message.text}</ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="topicId">Quiz Topic</Label>
          <Select
            id="topicId"
            name="topicId"
            value={formData.topicId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a topic</option>
            {topicsData.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="text">Question Text</Label>
          <TextArea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Enter your question here..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Answer Options</Label>
          <OptionsContainer>
            {formData.options.map((option, index) => (
              <OptionGroup key={index}>
                <RadioInput
                  type="radio"
                  name="correctOption"
                  checked={formData.correctOption === index}
                  onChange={() => handleCorrectOptionChange(index)}
                />
                <OptionInput
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </OptionGroup>
            ))}
          </OptionsContainer>
          <small style={{ color: '#666', fontStyle: 'italic' }}>
            Select the radio button next to the correct answer
          </small>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="explanation">Explanation</Label>
          <TextArea
            id="explanation"
            name="explanation"
            value={formData.explanation}
            onChange={handleInputChange}
            placeholder="Provide an explanation for the correct answer..."
            required
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Adding Question...' : 'Add Question'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default AddQuestionForm;
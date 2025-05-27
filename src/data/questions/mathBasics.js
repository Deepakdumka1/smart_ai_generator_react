export const mathBasicsQuestions = [
  // Easy Questions
  {
    id: 'math-easy-1',
    topicId: 'math-basics',
    text: 'What is the result of 7 × 8?',
    options: ['54', '56', '64', '48'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: '7 × 8 = 56'
  },
  {
    id: 'math-easy-2',
    topicId: 'math-basics',
    text: 'What is the square root of 81?',
    options: ['8', '9', '10', '7'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The square root of 81 is 9 because 9 × 9 = 81.'
  },
  {
    id: 'math-easy-3',
    topicId: 'math-basics',
    text: 'What is 25% of 80?',
    options: ['15', '20', '25', '40'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: '25% of 80 = 0.25 × 80 = 20'
  },
  
  // Medium Questions
  {
    id: 'math-medium-1',
    topicId: 'math-basics',
    text: 'Solve for x: 3x + 7 = 22',
    options: ['3', '5', '7', '15'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '3x + 7 = 22\n3x = 15\nx = 5'
  },
  {
    id: 'math-medium-2',
    topicId: 'math-basics',
    text: 'What is the area of a circle with radius 6 cm? (Use π = 3.14)',
    options: ['36π cm²', '12π cm²', '24π cm²', '18π cm²'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Area of a circle = πr². With r = 6, we get π × 6² = 36π cm².'
  },
  {
    id: 'math-medium-3',
    topicId: 'math-basics',
    text: 'If a triangle has sides of lengths 3, 4, and 5, what is its area?',
    options: ['4', '6', '10', '12'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'This is a 3-4-5 right triangle. Area = (base × height)/2 = (3 × 4)/2 = 6'
  },
  
  // Hard Questions
  {
    id: 'math-hard-1',
    topicId: 'math-basics',
    text: 'What is the solution to the quadratic equation x² - 5x + 6 = 0?',
    options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 2, x = -3', 'x = -2, x = 3'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'Using the quadratic formula or factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3.'
  },
  {
    id: 'math-hard-2',
    topicId: 'math-basics',
    text: 'What is the derivative of f(x) = x³ - 4x² + 2x - 7?',
    options: ['f\'(x) = 3x² - 8x + 2', 'f\'(x) = 3x² - 4x + 2', 'f\'(x) = 3x² - 8x - 7', 'f\'(x) = x² - 8x + 2'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'Taking the derivative term by term: f\'(x) = 3x² - 8x + 2'
  },
  {
    id: 'math-hard-3',
    topicId: 'math-basics',
    text: 'In a geometric sequence, if a₁ = 4 and r = 3, what is the sum of the first 5 terms?',
    options: ['364', '484', '604', '724'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'The sum of a geometric sequence is given by S = a₁(1-rⁿ)/(1-r) where n is the number of terms. With a₁ = 4, r = 3, and n = 5, we get S = 4(1-3⁵)/(1-3) = 4(1-243)/(-2) = 4 × 242 / 2 = 484.'
  }
]; 
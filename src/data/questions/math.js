export const mathQuestions = [
  // Easy Questions
  {
    id: 'math-easy-1',
    topicId: 'math-basics',
    text: 'What is the area of a triangle with base 6 cm and height 4 cm?',
    options: ['10 cm²', '12 cm²', '24 cm²', '30 cm²'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Area = ½ × base × height = ½ × 6 × 4 = 12'
  },
  {
    id: 'math-easy-2',
    topicId: 'math-basics',
    text: 'Which of the following is a linear equation?',
    options: ['x² + 2 = 0', 'y = 2x + 3', 'x³ = 27', 'x² - 4x = 0'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Linear equations have variables to the power of 1.'
  },
  {
    id: 'math-easy-3',
    topicId: 'math-basics',
    text: 'If x² – 4x + 3 = 0, then x = ?',
    options: ['1, 3', '2, 3', '1, 4', '1, 2'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Factor: (x–1)(x–3) = 0 → x = 1 or 3'
  },
  {
    id: 'math-easy-4',
    topicId: 'math-basics',
    text: 'In a triangle ABC, if angle A = 90°, b = 6 cm, c = 10 cm, find side a.',
    options: ['8 cm', '7 cm', '6 cm', '5 cm'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Use Pythagoras: a² = c² - b² = 100 - 36 = 64 → a = 8'
  },
  {
    id: 'math-easy-5',
    topicId: 'math-basics',
    text: 'What is the slope of the line joining (1, 2) and (3, 6)?',
    options: ['2', '1', '4', '3'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: '(6 – 2)/(3 – 1) = 4/2 = 2'
  },
  {
    id: 'math-easy-6',
    topicId: 'math-basics',
    text: 'A polynomial p(x) = x² - 3x + 2. What are its zeros?',
    options: ['2, 3', '1, 2', '-1, -2', '0, 1'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Factor: (x – 1)(x – 2)'
  },
  {
    id: 'math-easy-7',
    topicId: 'math-basics',
    text: 'Volume of a cube with side 4 cm is:',
    options: ['16 cm³', '64 cm³', '32 cm³', '48 cm³'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Volume = a³ = 4³ = 64'
  },
  {
    id: 'math-easy-8',
    topicId: 'math-basics',
    text: 'Median of 5, 8, 9, 12, 13 is:',
    options: ['9', '10', '11', '8'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Middle value = 3rd term = 9 (odd set)'
  },
  {
    id: 'math-easy-9',
    topicId: 'math-basics',
    text: 'Find the surface area of a sphere with radius 7 cm.',
    options: ['154 cm²', '294 cm²', '616 cm²', '308 cm²'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Surface area = 4πr² = 4 × 22/7 × 49 = 616'
  },
  {
    id: 'math-easy-10',
    topicId: 'math-basics',
    text: 'The coordinates of the origin are:',
    options: ['(0, 1)', '(1, 0)', '(0, 0)', '(1, 1)'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Origin is at (0, 0)'
  },

  // Medium Questions
  {
    id: 'math-medium-1',
    topicId: 'math-intermediate',
    text: 'A shopkeeper gives 10% discount on an item of ₹500. After tax of 8%, what is the final price?',
    options: ['₹486', '₹490', '₹484', '₹495'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Price after 10% off = 500 – 50 = 450, Tax = 8% of 450 = 36 → Final = 450 + 36 = ₹486'
  },
  {
    id: 'math-medium-2',
    topicId: 'math-intermediate',
    text: 'In a triangle, if two angles are 70° and 50°, find the third angle.',
    options: ['60°', '50°', '40°', '70°'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Sum of angles = 180° → 180 − (70 + 50) = 60°'
  },
  {
    id: 'math-medium-3',
    topicId: 'math-intermediate',
    text: 'Solve: 2/(x + 3) = 1/4. Find x.',
    options: ['5', '6', '–1', '–2'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Cross-multiply: 2 × 4 = 1(x + 3) → 8 = x + 3 → x = 5'
  },
  {
    id: 'math-medium-4',
    topicId: 'math-intermediate',
    text: 'A cube has surface area of 150 cm². Find the length of one side.',
    options: ['6 cm', '5 cm', '√25', '√16'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Surface area = 6a² → 150 = 6a² → a² = 25 → a = 5'
  },
  {
    id: 'math-medium-5',
    topicId: 'math-intermediate',
    text: 'If 5 : x = 15 : 27, find x.',
    options: ['8', '9', '10', '12'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Cross-multiplied: 5 × 27 = 135 → x = 135/15 = 9'
  },
  {
    id: 'math-medium-6',
    topicId: 'math-intermediate',
    text: 'A car travels 180 km in 3 hours and 240 km in 4 hours. What is the average speed?',
    options: ['60 km/h', '70 km/h', '65 km/h', '55 km/h'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Total distance = 420 km, total time = 7 hrs → 420/7 = 60'
  },
  {
    id: 'math-medium-7',
    topicId: 'math-intermediate',
    text: 'The probability of getting a prime number on a dice is:',
    options: ['1/3', '1/2', '2/3', '5/6'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Prime numbers on dice: 2, 3, 5 → 3/6 = 1/2'
  },
  {
    id: 'math-medium-8',
    topicId: 'math-intermediate',
    text: 'The diagonals of a rhombus are 12 cm and 16 cm. Find its area.',
    options: ['96 cm²', '48 cm²', '100 cm²', '72 cm²'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Area of rhombus = (1/2) × d₁ × d₂ = (1/2) × 12 × 16 = 96 cm²'
  },
  {
    id: 'math-medium-9',
    topicId: 'math-intermediate',
    text: 'If a number is decreased by 40%, it becomes 72. What was the original number?',
    options: ['100', '110', '115', '120'],
    correctOption: 3,
    difficulty: 'medium',
    explanation: 'Let original be x. x – 0.4x = 72 → 0.6x = 72 → x = 72 / 0.6 = 120'
  },
  {
    id: 'math-medium-10',
    topicId: 'math-intermediate',
    text: 'The exterior angle of a regular polygon is 36°. How many sides does it have?',
    options: ['9', '10', '12', '8'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Exterior angle = 360/n → n = 360/36 = 10'
  },

  // Hard Questions
  {
    id: 'math-hard-1',
    topicId: 'math-advanced',
    text: 'Solve: 2x² - 7x + 3 = 0',
    options: ['x = 1, 3', 'x = 1, 1.5', 'x = 3, 1/2', 'x = 3/2, 1'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Factor: (2x – 1)(x – 3) = 0 → x = 1/2, 3'
  },
  {
    id: 'math-hard-2',
    topicId: 'math-advanced',
    text: 'The roots of x² – 2x + 1 = 0 are:',
    options: ['1, –1', '1, 1', '2, –1', '2, 2'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: '(x – 1)² = 0'
  },
  {
    id: 'math-hard-3',
    topicId: 'math-advanced',
    text: 'A cube has a surface area of 150 cm². Find length of a side.',
    options: ['5 cm', '4 cm', '3 cm', '√25 cm'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'SA = 6a² → 6a² = 150 → a² = 25 → a = 5'
  },
  {
    id: 'math-hard-4',
    topicId: 'math-advanced',
    text: 'A triangle has sides 7 cm, 24 cm, and 25 cm. Is it right-angled?',
    options: ['Yes', 'No', 'Can\'t say', 'Only if angle A is 90°'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: '25² = 7² + 24² → 625 = 49 + 576 = 625'
  },
  {
    id: 'math-hard-5',
    topicId: 'math-advanced',
    text: 'A card is drawn from a pack. Probability of getting a king?',
    options: ['1/13', '1/4', '4/13', '1/52'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: '4 kings in 52 cards → 4/52 = 1/13'
  },
  {
    id: 'math-hard-6',
    topicId: 'math-advanced',
    text: 'The sum of first 15 natural numbers is:',
    options: ['110', '120', '115', '105'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Sum = n(n+1)/2 = 15×16/2 = 120'
  },
  {
    id: 'math-hard-7',
    topicId: 'math-advanced',
    text: 'The mean of 6, 8, 10, x, 14 is 10. Find x.',
    options: ['12', '10', '8', '6'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: '(6+8+10+x+14)/5 = 10 → x = 12'
  },
  {
    id: 'math-hard-8',
    topicId: 'math-advanced',
    text: 'A cylinder has height 10 cm and curved surface area 220 cm². Find radius.',
    options: ['2 cm', '3 cm', '3.5 cm', '4 cm'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'CSA = 2πrh → r = 220 / (2×22/7×10) = 3.5'
  },
  {
    id: 'math-hard-9',
    topicId: 'math-advanced',
    text: 'Factorise: x² + 5x + 6',
    options: ['(x + 3)(x + 2)', '(x – 3)(x – 2)', '(x – 3)(x + 2)', '(x + 1)(x + 6)'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: '3 × 2 = 6, 3 + 2 = 5'
  },
  {
    id: 'math-hard-10',
    topicId: 'math-advanced',
    text: 'In AP, if the first term a = 5, and common difference d = 3, find the 10th term.',
    options: ['30', '32', '35', '33'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'aₙ = a + (n – 1)d = 5 + 9×3 = 32'
  }
]; 
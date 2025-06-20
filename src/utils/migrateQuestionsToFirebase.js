// Migration script to upload questions to Firebase
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Topics data that corresponds to your questions
const topicsData = [
  {
    id: 'math-basics',
    name: 'Math Basics',
    description: 'Fundamental mathematics concepts including algebra, geometry, and calculus',
    icon: '🔢',
    color: '#4361ee'
  },
  {
    id: 'world-history',
    name: 'World History',
    description: 'Major historical events, civilizations, and important figures throughout history',
    icon: '🏛️',
    color: '#f72585'
  },
  {
    id: 'general-science',
    name: 'General Science',
    description: 'Basic concepts in physics, chemistry, biology, and earth science',
    icon: '🔬',
    color: '#4cc9f0'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Programming concepts, algorithms, data structures, and computer systems',
    icon: '💻',
    color: '#7209b7'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'JavaScript programming language fundamentals and advanced concepts',
    icon: '⚡',
    color: '#f39c12'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    icon: '🟢',
    color: '#68a063'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'High-level, interpreted programming language known for its readability',
    icon: '🐍',
    color: '#3776ab'
  },
  {
    id: 'html-css',
    name: 'HTML/CSS',
    description: 'Markup and styling languages for creating web pages',
    icon: '🎨',
    color: '#e34c26'
  },
  {
    id: 'react',
    name: 'React',
    description: 'JavaScript library for building user interfaces',
    icon: '⚛️',
    color: '#61dafb'
  }
];

// Sample questions data - you can replace this with your actual questions
const questionsData = [
  // Math Basics Questions
  {
    id: 'math-1',
    topicId: 'math-basics',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Basic addition: 2 + 2 = 4'
  },
  {
    id: 'math-2',
    topicId: 'math-basics',
    text: 'What is the square root of 16?',
    options: ['2', '3', '4', '5'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The square root of 16 is 4 because 4 × 4 = 16'
  },
  {
    id: 'math-3',
    topicId: 'math-basics',
    text: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '15% of 200 = 0.15 × 200 = 30'
  },
  {
    id: 'math-4',
    topicId: 'math-basics',
    text: 'Solve for x: 2x + 5 = 15',
    options: ['3', '5', '7', '10'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5'
  },
  {
    id: 'math-5',
    topicId: 'math-basics',
    text: 'What is the area of a circle with radius 3?',
    options: ['6π', '9π', '12π', '18π'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Area = πr² = π × 3² = 9π'
  },
  {
    id: 'math-6',
    topicId: 'math-basics',
    text: 'What is 12 × 8?',
    options: ['84', '92', '96', '104'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: '12 × 8 = 96'
  },
  {
    id: 'math-7',
    topicId: 'math-basics',
    text: 'What is the value of 5! (5 factorial)?',
    options: ['25', '60', '120', '240'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120'
  },
  {
    id: 'math-8',
    topicId: 'math-basics',
    text: 'What is the next number in the sequence: 2, 4, 8, 16, ...?',
    options: ['20', '24', '32', '64'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Each number is multiplied by 2 to get the next number (2×2=4, 4×2=8, 8×2=16, 16×2=32)'
  },
  {
    id: 'math-9',
    topicId: 'math-basics',
    text: 'What is 3/4 as a decimal?',
    options: ['0.25', '0.34', '0.5', '0.75'],
    correctOption: 3,
    difficulty: 'easy',
    explanation: '3 divided by 4 equals 0.75'
  },
  {
    id: 'math-10',
    topicId: 'math-basics',
    text: 'What is the square of 12?',
    options: ['124', '136', '144', '156'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: '12² = 12 × 12 = 144'
  },
  {
    id: 'math-11',
    topicId: 'math-basics',
    text: 'Solve for x: 3x - 7 = 20',
    options: ['7', '8', '9', '10'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: '3x - 7 = 20 → 3x = 27 → x = 9'
  },
  {
    id: 'math-12',
    topicId: 'math-basics',
    text: 'What is the greatest common divisor (GCD) of 36 and 48?',
    options: ['6', '12', '18', '24'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'The largest number that divides both 36 and 48 is 12'
  },
  {
    id: 'math-13',
    topicId: 'math-basics',
    text: 'What is the least common multiple (LCM) of 8 and 12?',
    options: ['16', '24', '36', '48'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'The smallest number that is a multiple of both 8 and 12 is 24'
  },
  {
    id: 'math-14',
    topicId: 'math-basics',
    text: 'What is the value of sin(30°)?',
    options: ['0', '0.5', '0.707', '1'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'sin(30°) = 0.5'
  },
  {
    id: 'math-15',
    topicId: 'math-basics',
    text: 'What is the derivative of x³ with respect to x?',
    options: ['x²', '2x²', '3x²', '4x²'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The derivative of x^n is n*x^(n-1), so for x³ it\'s 3x²'
  },
  {
    id: 'math-16',
    topicId: 'math-basics',
    text: 'What is the integral of 2x with respect to x?',
    options: ['x²', 'x² + C', '2x²', '2x² + C'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: '∫2x dx = x² + C, where C is the constant of integration'
  },
  {
    id: 'math-17',
    topicId: 'math-basics',
    text: 'What is the value of e (Euler\'s number) to 2 decimal places?',
    options: ['2.50', '2.71', '3.14', '3.16'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'e ≈ 2.71828..., so to 2 decimal places it\'s 2.71'
  },
  {
    id: 'math-18',
    topicId: 'math-basics',
    text: 'What is the Pythagorean theorem for a right triangle with legs a and b and hypotenuse c?',
    options: ['a + b = c', 'a² + b = c²', 'a² + b² = c²', 'a² + b² = c'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The Pythagorean theorem states that in a right triangle, a² + b² = c²'
  },
  {
    id: 'math-19',
    topicId: 'math-basics',
    text: 'What is the value of log₁₀(1000)?',
    options: ['1', '2', '3', '4'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: '10³ = 1000, so log₁₀(1000) = 3'
  },
  {
    id: 'math-20',
    topicId: 'math-basics',
    text: 'What is the sum of the interior angles of a triangle?',
    options: ['90°', '120°', '180°', '360°'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The sum of the interior angles of any triangle is always 180°'
  },
  
  // World History Questions
  {
    id: 'history-1',
    topicId: 'world-history',
    text: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'World War II ended in 1945 with the surrender of Japan'
  },
  {
    id: 'history-2',
    topicId: 'world-history',
    text: 'Who was the first President of the United States?',
    options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'George Washington was the first President of the United States (1789-1797)'
  },
  {
    id: 'history-3',
    topicId: 'world-history',
    text: 'Which empire was ruled by Julius Caesar?',
    options: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Egyptian Empire'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Julius Caesar was a Roman general and statesman who ruled the Roman Empire'
  },
  {
    id: 'history-4',
    topicId: 'world-history',
    text: 'The French Revolution began in which year?',
    options: ['1789', '1799', '1804', '1815'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The French Revolution began in 1789 with the storming of the Bastille'
  },
  {
    id: 'history-5',
    topicId: 'world-history',
    text: 'Who was the first emperor of China?',
    options: ['Qin Shi Huang', 'Confucius', 'Genghis Khan', 'Mao Zedong'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Qin Shi Huang was the first emperor of a unified China (221-210 BCE)'
  },
  {
    id: 'history-6',
    topicId: 'world-history',
    text: 'The Renaissance began in which country?',
    options: ['France', 'Germany', 'Italy', 'Spain'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The Renaissance began in Italy in the 14th century before spreading to the rest of Europe'
  },
  {
    id: 'history-7',
    topicId: 'world-history',
    text: 'Who wrote the 95 Theses in 1517?',
    options: ['John Calvin', 'Martin Luther', 'Henry VIII', 'Pope Leo X'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Martin Luther, a German monk, wrote the 95 Theses, sparking the Protestant Reformation'
  },
  {
    id: 'history-8',
    topicId: 'world-history',
    text: 'The Magna Carta was signed in which year?',
    options: ['1066', '1215', '1415', '1603'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The Magna Carta was signed by King John of England in 1215'
  },
  {
    id: 'history-9',
    topicId: 'world-history',
    text: 'The Industrial Revolution began in which country?',
    options: ['France', 'Germany', 'United Kingdom', 'United States'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The Industrial Revolution began in Great Britain in the late 18th century'
  },
  {
    id: 'history-10',
    topicId: 'world-history',
    text: 'Who was the first woman to win a Nobel Prize?',
    options: ['Marie Curie', 'Mother Teresa', 'Rosalind Franklin', 'Florence Nightingale'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Marie Curie was the first woman to win a Nobel Prize (Physics, 1903) and the only person to win in two different sciences'
  },
  {
    id: 'history-11',
    topicId: 'world-history',
    text: 'The Cold War primarily involved which two superpowers?',
    options: ['USA and China', 'USA and USSR', 'UK and USSR', 'China and USSR'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'The Cold War was a period of geopolitical tension between the United States and the Soviet Union (USSR)'
  },
  {
    id: 'history-12',
    topicId: 'world-history',
    text: 'The Berlin Wall fell in which year?',
    options: ['1985', '1989', '1991', '1993'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'The Berlin Wall fell on November 9, 1989, a key event in the end of the Cold War'
  },
  {
    id: 'history-13',
    topicId: 'world-history',
    text: 'Who was the leader of the Soviet Union during World War II?',
    options: ['Vladimir Lenin', 'Joseph Stalin', 'Nikita Khrushchev', 'Leon Trotsky'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Joseph Stalin led the Soviet Union from 1924 until his death in 1953, including during World War II'
  },
  {
    id: 'history-14',
    topicId: 'world-history',
    text: 'The Treaty of Versailles was signed after which war?',
    options: ['World War I', 'World War II', 'Franco-Prussian War', 'Crimean War'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The Treaty of Versailles was signed in 1919, ending World War I'
  },
  {
    id: 'history-15',
    topicId: 'world-history',
    text: 'The Byzantine Empire fell to which empire in 1453?',
    options: ['Holy Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'Persian Empire'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'The Byzantine Empire fell to the Ottoman Empire with the conquest of Constantinople in 1453'
  },
  {
    id: 'history-16',
    topicId: 'world-history',
    text: 'The Thirty Years\' War was primarily fought in which region?',
    options: ['Balkans', 'Iberian Peninsula', 'Central Europe', 'Scandinavia'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The Thirty Years\' War (1618-1648) was primarily fought in Central Europe, particularly in the Holy Roman Empire'
  },
  {
    id: 'history-17',
    topicId: 'world-history',
    text: 'The Meiji Restoration occurred in which country?',
    options: ['China', 'Korea', 'Japan', 'Vietnam'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The Meiji Restoration (1868) was a period of rapid modernization and industrialization in Japan'
  },
  {
    id: 'history-18',
    topicId: 'world-history',
    text: 'The Boer Wars were fought in which modern-day country?',
    options: ['Australia', 'Canada', 'South Africa', 'India'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The Boer Wars (1880-1881 and 1899-1902) were fought between the British Empire and the Boer states in South Africa'
  },
  {
    id: 'history-19',
    topicId: 'world-history',
    text: 'Who was known as the "Iron Lady"?',
    options: ['Queen Elizabeth II', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Margaret Thatcher, former British Prime Minister, was known as the "Iron Lady"'
  },
  
  // General Science Questions
  {
    id: 'science-1',
    topicId: 'general-science',
    text: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom: H2O'
  },
  {
    id: 'science-2',
    topicId: 'general-science',
    text: 'How many bones are in the adult human body?',
    options: ['196', '206', '216', '226'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'An adult human body has 206 bones'
  },
  {
    id: 'science-3',
    topicId: 'general-science',
    text: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Mars is known as the Red Planet due to its reddish appearance'
  },
  {
    id: 'science-4',
    topicId: 'general-science',
    text: 'What is the speed of light in vacuum?',
    options: ['299,792,458 m/s', '300,000,000 m/s', '186,000 miles/s', 'All of the above'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'The speed of light is approximately 299,792,458 m/s or 300,000 km/s or 186,000 miles/s'
  },
  {
    id: 'science-5',
    topicId: 'general-science',
    text: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Mitochondria are known as the powerhouse of the cell because they produce ATP energy'
  },
  {
    id: 'science-6',
    topicId: 'general-science',
    text: 'Which gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Plants absorb carbon dioxide (CO₂) during photosynthesis'
  },
  {
    id: 'science-7',
    topicId: 'general-science',
    text: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The chemical symbol for gold is Au (from Latin: aurum)'
  },
  {
    id: 'science-8',
    topicId: 'general-science',
    text: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Diamond is the hardest known natural material on the Mohs scale'
  },
  {
    id: 'science-9',
    topicId: 'general-science',
    text: 'Which planet is known as the Morning Star or Evening Star?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Venus is often called the Morning Star or Evening Star as it\'s visible near sunrise or sunset'
  },
  {
    id: 'science-10',
    topicId: 'general-science',
    text: 'What is the chemical formula for table salt?',
    options: ['NaCl', 'H₂O', 'CO₂', 'C₆H₁₂O₆'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Table salt is sodium chloride (NaCl)'
  },
  {
    id: 'science-11',
    topicId: 'general-science',
    text: 'What is the pH value of pure water?',
    options: ['0', '7', '10', '14'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Pure water has a neutral pH of 7'
  },
  {
    id: 'science-12',
    topicId: 'general-science',
    text: 'Which blood type is known as the universal donor?',
    options: ['A', 'B', 'AB', 'O'],
    correctOption: 3,
    difficulty: 'medium',
    explanation: 'Type O negative blood is considered the universal donor as it can be given to people of any blood type'
  },
  {
    id: 'science-13',
    topicId: 'general-science',
    text: 'What is the largest organ in the human body?',
    options: ['Liver', 'Brain', 'Skin', 'Lungs'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The skin is the body\'s largest organ, with an average area of about 20 square feet'
  },
  {
    id: 'science-14',
    topicId: 'general-science',
    text: 'Which element has the highest melting point?',
    options: ['Iron', 'Tungsten', 'Gold', 'Carbon'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'Carbon in the form of graphite has the highest melting point of all elements at about 3,700°C (6,692°F)'
  },
  {
    id: 'science-15',
    topicId: 'general-science',
    text: 'What is the Heisenberg Uncertainty Principle?',
    options: [
      'Energy cannot be created or destroyed',
      'It\'s impossible to know both position and momentum of a particle simultaneously',
      'For every action there\'s an equal and opposite reaction',
      'The speed of light is constant in a vacuum'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'The Heisenberg Uncertainty Principle states that the more precisely the position of a particle is determined, the less precisely its momentum can be known, and vice versa'
  },
  {
    id: 'science-16',
    topicId: 'general-science',
    text: 'What is the approximate age of the universe?',
    options: ['4.5 billion years', '10.5 billion years', '13.8 billion years', '20.1 billion years'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The current best estimate for the age of the universe is approximately 13.8 billion years'
  },
  {
    id: 'science-17',
    topicId: 'general-science',
    text: 'What is the process by which plants make their own food?',
    options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Fermentation'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Photosynthesis is the process by which green plants use sunlight to synthesize foods with the help of chlorophyll'
  },
  {
    id: 'science-18',
    topicId: 'general-science',
    text: 'Which gas makes up about 78% of the Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Nitrogen makes up about 78% of the Earth\'s atmosphere'
  },
  {
    id: 'science-19',
    topicId: 'general-science',
    text: 'What is the chemical formula for ozone?',
    options: ['O₂', 'O₃', 'CO₂', 'H₂O'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Ozone is a molecule made up of three oxygen atoms (O₃)'
  },
  {
    id: 'science-20',
    topicId: 'general-science',
    text: 'Which scientist proposed the theory of relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Galileo Galilei'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Albert Einstein proposed the theory of relativity, which includes the famous equation E=mc²'
  },
  
  // Computer Science Questions
  {
    id: 'cs-1',
    topicId: 'computer-science',
    text: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'HTML stands for Hyper Text Markup Language'
  },
  {
    id: 'cs-2',
    topicId: 'computer-science',
    text: 'Which of the following is a programming language?',
    options: ['HTTP', 'HTML', 'JavaScript', 'CSS'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'JavaScript is a programming language, while the others are protocols or markup languages'
  },
  {
    id: 'cs-3',
    topicId: 'computer-science',
    text: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'CPU stands for Central Processing Unit'
  },
  {
    id: 'cs-4',
    topicId: 'computer-science',
    text: 'Which data structure uses LIFO (Last In, First Out)?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed'
  },
  {
    id: 'cs-5',
    topicId: 'computer-science',
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each time'
  },
  {
    id: 'cs-6',
    topicId: 'computer-science',
    text: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'CSS stands for Cascading Style Sheets, used for styling web pages'
  },
  {
    id: 'cs-7',
    topicId: 'computer-science',
    text: 'Which of these is NOT a programming language?',
    options: ['Python', 'HTML', 'Java', 'C++'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'HTML is a markup language, not a programming language'
  },
  {
    id: 'cs-8',
    topicId: 'computer-science',
    text: 'What is the main purpose of an operating system?',
    options: [
      'To manage computer hardware and software resources',
      'To create documents',
      'To browse the internet',
      'To play games'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The main purpose of an operating system is to manage computer hardware and software resources'
  },
  {
    id: 'cs-9',
    topicId: 'computer-science',
    text: 'What is the binary representation of the decimal number 10?',
    options: ['1010', '1100', '1001', '1111'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The binary representation of decimal 10 is 1010 (8 + 0 + 2 + 0)'
  },
  {
    id: 'cs-10',
    topicId: 'computer-science',
    text: 'Which data structure uses FIFO (First In, First Out) principle?',
    options: ['Stack', 'Queue', 'Array', 'Tree'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Queue follows the FIFO principle where the first element added is the first one to be removed'
  },
  {
    id: 'cs-11',
    topicId: 'computer-science',
    text: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Accessing an element in an array by index is a constant time operation, O(1)'
  },
  {
    id: 'cs-12',
    topicId: 'computer-science',
    text: 'Which sorting algorithm has the worst-case time complexity of O(n²)?',
    options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Heap Sort'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'Bubble Sort has a worst-case time complexity of O(n²)'
  },
  {
    id: 'cs-13',
    topicId: 'computer-science',
    text: 'What is the main advantage of using a hash table?',
    options: [
      'Constant time average case for search, insert, and delete operations',
      'Guaranteed sorted order',
      'Minimal memory usage',
      'Efficient for range queries'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'Hash tables provide average-case O(1) time complexity for search, insert, and delete operations'
  },
  {
    id: 'cs-14',
    topicId: 'computer-science',
    text: 'Which of these is NOT a valid HTTP method?',
    options: ['GET', 'POST', 'FETCH', 'DELETE'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'FETCH is not a standard HTTP method. The standard methods include GET, POST, PUT, DELETE, etc.'
  },
  {
    id: 'cs-15',
    topicId: 'computer-science',
    text: 'What is the time complexity of the quicksort algorithm in the average case?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Quicksort has an average-case time complexity of O(n log n)'
  },
  {
    id: 'cs-16',
    topicId: 'computer-science',
    text: 'What is the purpose of the ACID properties in database systems?',
    options: [
      'To ensure data consistency',
      'To improve query performance',
      'To compress data',
      'To create database backups'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'ACID (Atomicity, Consistency, Isolation, Durability) properties ensure reliable processing of database transactions'
  },
  {
    id: 'cs-17',
    topicId: 'computer-science',
    text: 'Which of these is NOT a type of machine learning?',
    options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Distributed Learning'],
    correctOption: 3,
    difficulty: 'medium',
    explanation: 'The main types of machine learning are supervised, unsupervised, and reinforcement learning. Distributed learning is not a type of ML algorithm.'
  },
  {
    id: 'cs-18',
    topicId: 'computer-science',
    text: 'What is the time complexity of Dijkstra\'s algorithm using a binary heap?',
    options: ['O(V²)', 'O(V log V + E)', 'O(V + E log V)', 'O(E log V)'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'Dijkstra\'s algorithm with a binary heap has a time complexity of O((V+E) log V), which is commonly written as O(E log V) for a connected graph'
  },
  {
    id: 'cs-19',
    topicId: 'computer-science',
    text: 'What is the CAP theorem in distributed systems?',
    options: [
      'A system can only guarantee two out of Consistency, Availability, and Partition tolerance',
      'A system can have all three: Consistency, Availability, and Partition tolerance',
      'A system must choose between Consistency and Availability',
      'A system must be Consistent, Available, and Partition tolerant'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The CAP theorem states that a distributed system can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition tolerance'
  },
  {
    id: 'cs-20',
    topicId: 'computer-science',
    text: 'What is the time complexity of matrix multiplication for two n×n matrices using the standard algorithm?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'The standard matrix multiplication algorithm has a time complexity of O(n³) for two n×n matrices'
  },

  // JavaScript Questions
  {
    id: 'js-1',
    topicId: 'javascript',
    text: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'push() method adds one or more elements to the end of an array'
  },
  {
    id: 'js-2',
    topicId: 'javascript',
    text: 'What is the correct way to declare a variable in JavaScript?',
    options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'All of the above'],
    correctOption: 3,
    difficulty: 'easy',
    explanation: 'All three (var, let, const) are valid ways to declare variables in JavaScript'
  },
  {
    id: 'js-3',
    topicId: 'javascript',
    text: 'What does "=== " operator do in JavaScript?',
    options: ['Assignment', 'Equality without type checking', 'Strict equality with type checking', 'Not equal'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: '=== is the strict equality operator that checks both value and type'
  },
  {
    id: 'js-4',
    topicId: 'javascript',
    text: 'Which method is used to convert JSON string to JavaScript object?',
    options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.object()'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'JSON.parse() converts a JSON string into a JavaScript object'
  },
  {
    id: 'js-5',
    topicId: 'javascript',
    text: 'What is a closure in JavaScript?',
    options: ['A way to close the browser', 'A function that has access to outer scope', 'A method to end loops', 'A type of variable'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned'
  },
  {
    id: 'js-6',
    topicId: 'javascript',
    text: 'Which method removes the last element from an array and returns it?',
    options: ['pop()', 'shift()', 'splice()', 'slice()'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The pop() method removes the last element from an array and returns that element'
  },
  {
    id: 'js-7',
    topicId: 'javascript',
    text: 'What does the "this" keyword refer to in JavaScript?',
    options: [
      'The current function',
      'The global object',
      'The object that the function is a property of',
      'It depends on how the function is called'
    ],
    correctOption: 3,
    difficulty: 'medium',
    explanation: 'The value of "this" depends on how a function is called (its execution context)'
  },
  {
    id: 'js-8',
    topicId: 'javascript',
    text: 'What is the output of: console.log(1 + "1" - 1)?',
    options: ['"101"', '10', '11', 'NaN'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'First, "1" + "1" becomes "11" (string concatenation), then "11" - 1 performs numeric subtraction resulting in 10'
  },
  {
    id: 'js-9',
    topicId: 'javascript',
    text: 'What is the purpose of the "use strict" directive?',
    options: [
      'To enable strict mode which catches common coding mistakes',
      'To make JavaScript run faster',
      'To enable experimental features',
      'To disable all warnings'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '"use strict" enables strict mode which helps catch common coding mistakes and prevents the use of potentially problematic features'
  },
  {
    id: 'js-10',
    topicId: 'javascript',
    text: 'What is the difference between == and === in JavaScript?',
    options: [
      'There is no difference',
      '== compares values, === compares values and types',
      '=== is faster than ==',
      '== is the modern syntax, === is deprecated'
    ],
    correctOption: 1,
    difficulty: 'easy',
    explanation: '== performs type coercion before comparison, while === (strict equality) compares both value and type without coercion'
  },
  {
    id: 'js-11',
    topicId: 'javascript',
    text: 'What is a Promise in JavaScript?',
    options: [
      'A function that returns a value',
      'An object representing the eventual completion of an asynchronous operation',
      'A type of variable',
      'A way to declare constants'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation'
  },
  {
    id: 'js-12',
    topicId: 'javascript',
    text: 'What is the output of: console.log(typeof [])?',
    options: ['array', 'object', 'array object', 'undefined'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'In JavaScript, arrays are a type of object, so typeof [] returns "object"'
  },
  {
    id: 'js-13',
    topicId: 'javascript',
    text: 'What is the purpose of the async/await syntax?',
    options: [
      'To make synchronous code look like asynchronous code',
      'To handle asynchronous operations in a synchronous-looking way',
      'To create web workers',
      'To optimize loops'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'async/await allows writing asynchronous code that looks and behaves like synchronous code, making it easier to understand'
  },
  {
    id: 'js-14',
    topicId: 'javascript',
    text: 'What is the difference between null and undefined?',
    options: [
      'There is no difference',
      'undefined means a variable has been declared but not assigned a value, null is an explicit assignment',
      'null is a primitive, undefined is an object',
      'undefined is used for numbers, null for strings'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'undefined means a variable has been declared but not assigned a value, while null is an explicit assignment representing no value'
  },
  {
    id: 'js-15',
    topicId: 'javascript',
    text: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?',
    options: ['true', 'false', 'undefined', 'NaN'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Due to floating-point precision issues in JavaScript, 0.1 + 0.2 equals approximately 0.30000000000000004, not exactly 0.3'
  },
  {
    id: 'js-16',
    topicId: 'javascript',
    text: 'What is the purpose of the bind() method?',
    options: [
      'To create a new function with a specific this value',
      'To concatenate strings',
      'To clone an object',
      'To bind event listeners'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The bind() method creates a new function that, when called, has its this keyword set to the provided value'
  },
  {
    id: 'js-17',
    topicId: 'javascript',
    text: 'What is a higher-order function?',
    options: [
      'A function that takes another function as an argument or returns a function',
      'A function with a higher scope',
      'A function that runs faster than others',
      'A function with more than 10 parameters'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'A higher-order function is a function that takes another function as an argument or returns a function as its result'
  },
  {
    id: 'js-18',
    topicId: 'javascript',
    text: 'What is the purpose of the map() method?',
    options: [
      'To create a map data structure',
      'To transform each element in an array and return a new array',
      'To filter array elements',
      'To combine array elements'
    ],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The map() method creates a new array with the results of calling a provided function on every element in the array'
  },
  {
    id: 'js-19',
    topicId: 'javascript',
    text: 'What is the difference between let, const, and var?',
    options: [
      'They are exactly the same',
      'let and const are block-scoped, var is function-scoped. const cannot be reassigned',
      'var is modern, let and const are deprecated',
      'let is for numbers, const for strings, var for booleans'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned after declaration'
  },
  {
    id: 'js-20',
    topicId: 'javascript',
    text: 'What is the output of: console.log([1, 2, 3] + [4, 5, 6])?',
    options: ['[1,2,3,4,5,6]', '1,2,34,5,6', '10', 'Error'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'In JavaScript, when arrays are added with +, they are converted to strings first, resulting in "1,2,3" + "4,5,6" = "1,2,34,5,6"'
  },
  
  // Node.js Questions
  {
    id: 'node-1',
    topicId: 'nodejs',
    text: 'What is the purpose of the `require` function in Node.js?',
    options: [
      'To include external modules',
      'To make HTTP requests',
      'To create server instances',
      'To handle file operations'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The `require` function is used to include external modules in Node.js applications.'
  },
  {
    id: 'node-2',
    topicId: 'nodejs',
    text: 'What is the global object in Node.js?',
    options: ['window', 'document', 'global', 'console'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'In Node.js, `global` is the global object, similar to `window` in browsers.'
  },
  {
    id: 'node-3',
    topicId: 'nodejs',
    text: 'Which module is used to create a web server in Node.js?',
    options: ['http', 'url', 'fs', 'path'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The `http` module is used to create HTTP servers in Node.js.'
  },
  {
    id: 'node-4',
    topicId: 'nodejs',
    text: 'What is the purpose of `process.nextTick()`?',
    options: [
      'To execute a function in the next iteration of the event loop',
      'To terminate the Node.js process',
      'To create a new process',
      'To measure execution time'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '`process.nextTick()` adds a callback to the next iteration of the event loop.'
  },
  {
    id: 'node-5',
    topicId: 'nodejs',
    text: 'What is the purpose of the `__dirname` variable?',
    options: [
      'Gets the current working directory',
      'Gets the directory name of the current module',
      'Gets the name of the current file',
      'Gets the root directory of the project'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '`__dirname` contains the directory name of the current module.'
  },
  {
    id: 'node-6',
    topicId: 'nodejs',
    text: 'What is the purpose of the `cluster` module?',
    options: [
      'To create child processes',
      'To manage database connections',
      'To handle file uploads',
      'To create web servers'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The `cluster` module allows easy creation of child processes that share server ports.'
  },
  {
    id: 'node-7',
    topicId: 'nodejs',
    text: 'What does the `EventEmitter` class do in Node.js?',
    options: [
      'Handles HTTP requests',
      'Provides an interface for working with file paths',
      'Allows objects to emit and listen to events',
      'Manages database connections'
    ],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The `EventEmitter` class is used to handle events in Node.js, allowing objects to emit and listen to custom events.'
  },
  {
    id: 'node-8',
    topicId: 'nodejs',
    text: 'What is the purpose of the `Buffer` class in Node.js?',
    options: [
      'To handle binary data',
      'To manage memory allocation',
      'To create temporary files',
      'To handle HTTP requests'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The `Buffer` class in Node.js is used to handle binary data directly.'
  },
  {
    id: 'node-9',
    topicId: 'nodejs',
    text: 'What is the purpose of the `stream` module in Node.js?',
    options: [
      'To handle data streaming',
      'To manage database connections',
      'To create web servers',
      'To handle file operations'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The `stream` module provides an API for implementing the stream interface for working with streaming data.'
  },
  {
    id: 'node-10',
    topicId: 'nodejs',
    text: 'What is the purpose of the `process.env` object?',
    options: [
      'To access environment variables',
      'To manage child processes',
      'To handle errors',
      'To manage file operations'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The `process.env` property returns an object containing the user environment.'
  },
  
  // Python Questions
  {
    id: 'py-1',
    topicId: 'python',
    text: 'What is the output of: `print(2 ** 3 ** 2)`?',
    options: ['64', '512', '256', 'Error'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Exponentiation is right-associative in Python, so 3**2 is 9, then 2**9 is 512.'
  },
  {
    id: 'py-2',
    topicId: 'python',
    text: 'Which of these is NOT a built-in data type in Python?',
    options: ['list', 'tuple', 'array', 'dictionary'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: '`array` is not a built-in type; it needs to be imported from the `array` module.'
  },
  {
    id: 'py-3',
    topicId: 'python',
    text: 'What is the purpose of `__init__.py` files?',
    options: [
      'To initialize variables',
      'To mark a directory as a Python package',
      'To run initialization code',
      'To define class constructors'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '`__init__.py` files are used to mark directories as Python package directories.'
  },
  {
    id: 'py-4',
    topicId: 'python',
    text: 'What is the output of: `[x**2 for x in range(5)]`?',
    options: [
      '[0, 1, 4, 9, 16]',
      '[1, 2, 3, 4, 5]',
      '[0, 1, 4, 9, 16, 25]',
      '[1, 4, 9, 16, 25]'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'This list comprehension generates squares of numbers from 0 to 4.'
  },
  {
    id: 'py-5',
    topicId: 'python',
    text: 'What is the difference between `list` and `tuple` in Python?',
    options: [
      'Lists are mutable, tuples are immutable',
      'Tuples can store different data types, lists cannot',
      'Lists use square brackets, tuples use parentheses',
      'Both A and C'
    ],
    correctOption: 3,
    difficulty: 'easy',
    explanation: 'Lists are mutable and use square brackets, while tuples are immutable and use parentheses.'
  },
  {
    id: 'py-6',
    topicId: 'python',
    text: 'What is the purpose of the `with` statement in Python?',
    options: [
      'To define a context manager',
      'To create a loop',
      'To handle exceptions',
      'To import modules'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The `with` statement is used to wrap the execution of a block with methods defined by a context manager.'
  },
  {
    id: 'py-7',
    topicId: 'python',
    text: 'What is a decorator in Python?',
    options: [
      'A function that takes another function and extends its behavior',
      'A special kind of comment',
      'A way to create classes',
      'A type of loop'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.'
  },
  {
    id: 'py-8',
    topicId: 'python',
    text: 'What is the purpose of the `yield` keyword?',
    options: [
      'To define a generator function',
      'To return a value from a function',
      'To raise an exception',
      'To create a class'
    ],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'The `yield` keyword is used to define a generator function, which returns a generator iterator.'
  },
  {
    id: 'py-9',
    topicId: 'python',
    text: 'What is the difference between `==` and `is` in Python?',
    options: [
      '`==` compares values, `is` compares identities',
      '`is` compares values, `==` compares identities',
      'They are identical in functionality',
      '`==` is for numbers, `is` is for strings'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '`==` compares the values of objects, while `is` checks if two references point to the same object.'
  },
  {
    id: 'py-10',
    topicId: 'python',
    text: 'What is the purpose of the `__name__` variable?',
    options: [
      'To get the name of the current module',
      'To define a class name',
      'To create a variable',
      'To import modules'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '`__name__` is a built-in variable which evaluates to the name of the current module.'
  },
  
  // HTML/CSS Questions
  {
    id: 'html-1',
    topicId: 'html-css',
    text: 'Which HTML5 element is used for navigation links?',
    options: ['<nav>', '<links>', '<navigate>', '<navigation>'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The <nav> element is used to define navigation links.'
  },
  {
    id: 'html-2',
    topicId: 'html-css',
    text: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Creative Style Sheets',
      'Cascading Style Sheets',
      'Colorful Style Sheets'
    ],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'CSS stands for Cascading Style Sheets.'
  },
  {
    id: 'html-3',
    topicId: 'html-css',
    text: 'Which HTML5 element is used for the main content of a document?',
    options: ['<main>', '<content>', '<body>', '<section>'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The <main> element represents the main content of the body of a document.'
  },
  {
    id: 'html-4',
    topicId: 'html-css',
    text: 'What is the correct HTML5 doctype declaration?',
    options: [
      '<!DOCTYPE html5>',
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 5.0//EN">',
      '<!DOCTYPE html>',
      '<!DOCTYPE HTML5>'
    ],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The correct HTML5 doctype is <!DOCTYPE html>.'
  },
  {
    id: 'html-5',
    topicId: 'html-css',
    text: 'Which CSS property is used to change the text color?',
    options: ['text-color', 'font-color', 'color', 'text-style'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The `color` property is used to set the color of the text.'
  },
  {
    id: 'html-6',
    topicId: 'html-css',
    text: 'What is the purpose of the `box-sizing` property in CSS?',
    options: [
      'To change the box model',
      'To add shadows to elements',
      'To create animations',
      'To handle text overflow'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The `box-sizing` property is used to change the default CSS box model.'
  },
  {
    id: 'html-7',
    topicId: 'html-css',
    text: 'What is the difference between `margin` and `padding`?',
    options: [
      'Margin is inside the border, padding is outside',
      'Padding is inside the border, margin is outside',
      'They are the same thing',
      'Margin is for text, padding is for blocks'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Padding is the space between the content and the border, while margin is the space outside the border.'
  },
  {
    id: 'html-8',
    topicId: 'html-css',
    text: 'What is the purpose of the `z-index` property?',
    options: [
      'To control the stacking order of elements',
      'To create 3D effects',
      'To set the zoom level',
      'To control text wrapping'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The `z-index` property specifies the stack order of an element.'
  },
  {
    id: 'html-9',
    topicId: 'html-css',
    text: 'What is the difference between `display: none` and `visibility: hidden`?',
    options: [
      'They are identical',
      '`display: none` removes the element from the document flow',
      '`visibility: hidden` removes the element from the document flow',
      '`display: none` only works in modern browsers'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: '`display: none` removes the element from the document flow, while `visibility: hidden` just makes it invisible but still takes up space.'
  },
  {
    id: 'html-10',
    topicId: 'html-css',
    text: 'What is the purpose of CSS Grid?',
    options: [
      'To create 3D transforms',
      'To create flexible two-dimensional layouts',
      'To style form elements',
      'To create animations'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'CSS Grid is a layout system for creating two-dimensional layouts with rows and columns.'
  },
  
  // React Questions
  {
    id: 'react-1',
    topicId: 'react',
    text: 'What is the correct syntax for creating a functional component in React?',
    options: [
      'function MyComponent() { return <div>Hello</div>; }',
      'class MyComponent extends React.Component { render() { return <div>Hello</div>; } }',
      'const MyComponent = () => { <div>Hello</div> }',
      'Both A and C'
    ],
    correctOption: 3,
    difficulty: 'easy',
    explanation: 'Both function declaration and arrow function syntax can be used to create functional components.'
  },
  {
    id: 'react-2',
    topicId: 'react',
    text: 'What is the purpose of the `useEffect` hook?',
    options: [
      'To perform side effects in function components',
      'To manage state in class components',
      'To handle events',
      'To create context'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: '`useEffect` lets you perform side effects in function components.'
  },
  {
    id: 'react-3',
    topicId: 'react',
    text: 'What is the purpose of the `key` prop in React?',
    options: [
      'To provide a unique identifier for elements in a list',
      'To encrypt component data',
      'To define keyboard shortcuts',
      'To set the component state'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'The `key` prop helps React identify which items have changed, are added, or are removed in lists.'
  },
  {
    id: 'react-4',
    topicId: 'react',
    text: 'What is the difference between state and props?',
    options: [
      'State is mutable, props are read-only',
      'Props are mutable, state is read-only',
      'They are the same thing',
      'State is for functions, props are for classes'
    ],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'State is mutable and managed within the component, while props are read-only and passed from parent to child components.'
  },
  {
    id: 'react-5',
    topicId: 'react',
    text: 'What is the purpose of React Router?',
    options: [
      'To manage state in React applications',
      'To handle navigation in React applications',
      'To style React components',
      'To manage forms in React'
    ],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'React Router is used for navigation and routing in React applications.'
  },
  {
    id: 'react-6',
    topicId: 'react',
    text: 'What is the purpose of the `useState` hook?',
    options: [
      'To perform side effects',
      'To manage state in function components',
      'To create context',
      'To handle events'
    ],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The `useState` hook allows you to add state to function components.'
  },
  {
    id: 'react-7',
    topicId: 'react',
    text: 'What is the purpose of the `useContext` hook?',
    options: [
      'To manage component state',
      'To perform side effects',
      'To access the context',
      'To create refs'
    ],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'The `useContext` hook is used to access the value of a Context object.'
  },
  {
    id: 'react-8',
    topicId: 'react',
    text: 'What is the purpose of the `useRef` hook?',
    options: [
      'To create a reference to a DOM element',
      'To manage state',
      'To perform side effects',
      'To create context'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The `useRef` hook is used to create a mutable reference that persists across renders.'
  },
  {
    id: 'react-9',
    topicId: 'react',
    text: 'What is the purpose of the `useCallback` hook?',
    options: [
      'To manage state',
      'To memoize functions',
      'To perform side effects',
      'To create context'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'The `useCallback` hook is used to memoize functions to prevent unnecessary re-renders.'
  },
  {
    id: 'react-10',
    topicId: 'react',
    text: 'What is the purpose of the `useMemo` hook?',
    options: [
      'To manage state',
      'To memoize values',
      'To perform side effects',
      'To create context'
    ],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'The `useMemo` hook is used to memoize expensive calculations to improve performance.'
  },
  
  // General Science Questions
  {
    id: 'gs-1',
    topicId: 'general-science',
    text: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The chemical symbol for gold is Au, from the Latin word "aurum".'
  },
  {
    id: 'gs-2',
    topicId: 'general-science',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Mars is known as the Red Planet due to iron oxide (rust) on its surface.'
  },
  {
    id: 'gs-3',
    topicId: 'general-science',
    text: 'What is the chemical formula for water?',
    options: ['CO2', 'H2O', 'NaCl', 'O2'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The chemical formula for water is H₂O, meaning each molecule contains two hydrogen atoms and one oxygen atom.'
  },
  {
    id: 'gs-4',
    topicId: 'general-science',
    text: 'What is the largest organ in the human body?',
    options: ['Liver', 'Brain', 'Skin', 'Heart'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The skin is the largest organ in the human body, with an average area of about 20 square feet.'
  },
  {
    id: 'gs-5',
    topicId: 'general-science',
    text: 'What is the speed of light in a vacuum?',
    options: [
      '300,000 km/s',
      '150,000 km/s',
      '500,000 km/s',
      '1,000,000 km/s'
    ],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The speed of light in a vacuum is approximately 300,000 kilometers per second (186,282 miles per second).'
  },
  {
    id: 'gs-6',
    topicId: 'general-science',
    text: 'What is the atomic number of carbon?',
    options: ['6', '12', '14', '8'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.'
  },
  {
    id: 'gs-7',
    topicId: 'general-science',
    text: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Mitochondria are often called the powerhouse of the cell because they generate most of the cell\'s supply of ATP.'
  },
  {
    id: 'gs-8',
    topicId: 'general-science',
    text: 'What is the chemical symbol for silver?',
    options: ['Si', 'Ag', 'Au', 'S'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'The chemical symbol for silver is Ag, from the Latin word "argentum".'
  },
  {
    id: 'gs-9',
    topicId: 'general-science',
    text: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Diamond is the hardest known natural material on the Mohs scale of mineral hardness.'
  },
  {
    id: 'gs-10',
    topicId: 'general-science',
    text: 'What is the main gas that makes up the Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Nitrogen makes up about 78% of the Earth\'s atmosphere.'
  }
];

// Function to migrate topics to Firebase
export const migrateTopicsToFirebase = async () => {
  try {
    console.log('Starting topics migration...');
    
    for (const topic of topicsData) {
      // Check if topic already exists
      const topicQuery = query(collection(db, 'topics'), where('id', '==', topic.id));
      const existingTopics = await getDocs(topicQuery);
      
      if (existingTopics.empty) {
        // Add topic to Firebase
        await addDoc(collection(db, 'topics'), {
          ...topic,
          createdAt: new Date(),
          questionCount: questionsData.filter(q => q.topicId === topic.id).length
        });
        console.log(`✅ Added topic: ${topic.name}`);
      } else {
        console.log(`⚠️ Topic already exists: ${topic.name}`);
      }
    }
    
    console.log('Topics migration completed!');
  } catch (error) {
    console.error('Error migrating topics:', error);
    throw error;
  }
};

// Function to migrate questions to Firebase
export const migrateQuestionsToFirebase = async () => {
  try {
    console.log('Starting questions migration...');
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const question of questionsData) {
      // Check if question already exists
      const questionQuery = query(collection(db, 'questions'), where('id', '==', question.id));
      const existingQuestions = await getDocs(questionQuery);
      
      if (existingQuestions.empty) {
        // Transform the question data to match Firebase structure
        const firebaseQuestion = {
          id: question.id,
          topicId: question.topicId,
          question: question.text, // Map 'text' to 'question'
          options: question.options,
          correctAnswer: question.correctOption, // Map 'correctOption' to 'correctAnswer'
          difficulty: question.difficulty,
          explanation: question.explanation,
          createdAt: new Date(),
          isActive: true
        };
        
        // Add question to Firebase
        await addDoc(collection(db, 'questions'), firebaseQuestion);
        addedCount++;
        console.log(`✅ Added question: ${question.id}`);
      } else {
        skippedCount++;
        console.log(`⚠️ Question already exists: ${question.id}`);
      }
    }
    
    console.log(`Questions migration completed! Added: ${addedCount}, Skipped: ${skippedCount}`);
    return { addedCount, skippedCount };
  } catch (error) {
    console.error('Error migrating questions:', error);
    throw error;
  }
};

// Function to run complete migration
export const runCompleteMigration = async () => {
  console.log('🚀 Starting complete migration to Firebase...');
  
  try {
    // First migrate topics
    await migrateTopicsToFirebase();
    
    // Then migrate questions
    const questionResult = await migrateQuestionsToFirebase();
    
    console.log('🎉 Complete migration finished successfully!');
    
    // Display summary
    const topicsSnapshot = await getDocs(collection(db, 'topics'));
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    
    console.log(`📊 Migration Summary:`);
    console.log(`   Topics in Firebase: ${topicsSnapshot.size}`);
    console.log(`   Questions in Firebase: ${questionsSnapshot.size}`);
    console.log(`   Questions added this session: ${questionResult.addedCount}`);
    console.log(`   Questions skipped (already exist): ${questionResult.skippedCount}`);
    
    return {
      success: true,
      topicsCount: topicsSnapshot.size,
      questionsCount: questionsSnapshot.size,
      addedCount: questionResult.addedCount,
      skippedCount: questionResult.skippedCount
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get questions by topic from Firebase
export const getQuestionsByTopic = async (topicId, difficulty = null, limit = null) => {
  try {
    let q = query(
      collection(db, 'questions'),
      where('topicId', '==', topicId),
      where('isActive', '==', true)
    );
    
    // Add difficulty filter if specified
    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }
    
    const querySnapshot = await getDocs(q);
    let questions = querySnapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
    
    // Shuffle questions for randomness
    questions = questions.sort(() => Math.random() - 0.5);
    
    // Limit number of questions if specified
    if (limit) {
      questions = questions.slice(0, limit);
    }
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions from Firebase:', error);
    return [];
  }
};

// Function to get all topics from Firebase
export const getTopicsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'topics'));
    const topics = querySnapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
    
    // Sort topics by name
    topics.sort((a, b) => a.name.localeCompare(b.name));
    
    return topics;
  } catch (error) {
    console.error('Error fetching topics from Firebase:', error);
    return [];
  }
};

// Function to get topic by ID from Firebase
export const getTopicById = async (topicId) => {
  try {
    const q = query(collection(db, 'topics'), where('id', '==', topicId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        firebaseId: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching topic by ID:', error);
    return null;
  }
};

// Function to get random questions for quiz
export const getRandomQuestionsForQuiz = async (topicId, count = 10, difficulty = null) => {
  try {
    const questions = await getQuestionsByTopic(topicId, difficulty);
    
    // Shuffle and limit to requested count
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error('Error getting random questions for quiz:', error);
    return [];
  }
};
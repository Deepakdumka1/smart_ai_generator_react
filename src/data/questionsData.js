export const questionsData = [
  // Math Basics - Easy Questions
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
  
  // Math Basics - Medium Questions
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
  
  // Math Basics - Hard Questions
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
  },
  
  // World History - Easy Questions
  {
    id: 'history-easy-1',
    topicId: 'world-history',
    text: 'Who was the first President of the United States?',
    options: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.'
  },
  {
    id: 'history-easy-2',
    topicId: 'world-history',
    text: 'In which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'World War II ended in 1945 with the surrender of Japan after the atomic bombings of Hiroshima and Nagasaki.'
  },
  {
    id: 'history-easy-3',
    topicId: 'world-history',
    text: 'Which ancient civilization built the pyramids at Giza?',
    options: ['Romans', 'Greeks', 'Egyptians', 'Mesopotamians'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'The ancient Egyptians built the pyramids at Giza around 2500 BCE.'
  },
  
  // World History - Medium Questions
  {
    id: 'history-medium-1',
    topicId: 'world-history',
    text: 'Which treaty ended World War I?',
    options: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of London', 'Treaty of Rome'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'The Treaty of Versailles, signed in 1919, formally ended World War I.'
  },
  {
    id: 'history-medium-2',
    topicId: 'world-history',
    text: 'Who was the leader of the Soviet Union during most of World War II?',
    options: ['Vladimir Lenin', 'Leon Trotsky', 'Joseph Stalin', 'Nikita Khrushchev'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'Joseph Stalin was the leader of the Soviet Union during most of World War II, from the early 1920s until his death in 1953.'
  },
  {
    id: 'history-medium-3',
    topicId: 'world-history',
    text: 'Which of these events occurred first?',
    options: ['The American Revolution', 'The French Revolution', 'The Russian Revolution', 'The Industrial Revolution'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'The American Revolution (1775-1783) occurred before the French Revolution (1789-1799), the Industrial Revolution (late 18th to 19th century), and the Russian Revolution (1917).'
  },
  
  // World History - Hard Questions
  {
    id: 'history-hard-1',
    topicId: 'world-history',
    text: 'Which of these was NOT a cause of World War I?',
    options: ['Militarism', 'Alliances', 'Imperialism', 'The Great Depression'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'The Great Depression began in 1929, well after World War I (1914-1918). The main causes of WWI are often summarized as MAIN: Militarism, Alliances, Imperialism, and Nationalism.'
  },
  {
    id: 'history-hard-2',
    topicId: 'world-history',
    text: 'Which Chinese dynasty was in power when European colonization of the Americas began?',
    options: ['Tang Dynasty', 'Song Dynasty', 'Ming Dynasty', 'Qing Dynasty'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'The Ming Dynasty (1368-1644) was in power in China when European colonization of the Americas began in the late 15th and early 16th centuries.'
  },
  {
    id: 'history-hard-3',
    topicId: 'world-history',
    text: 'What was the name of the economic and political system in medieval Europe where land was exchanged for military service and loyalty?',
    options: ['Mercantilism', 'Feudalism', 'Capitalism', 'Communism'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Feudalism was the dominant social system in medieval Europe, in which land (fiefs) was granted to vassals in exchange for military service and loyalty to the lord.'
  },
  
  // General Science - Easy Questions
  {
    id: 'science-easy-1',
    topicId: 'general-science',
    text: 'What is the chemical symbol for water?',
    options: ['W', 'WA', 'H2O', 'O2H'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'H2O is the chemical formula for water, representing two hydrogen atoms and one oxygen atom.'
  },
  {
    id: 'science-easy-2',
    topicId: 'general-science',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Mars is known as the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.'
  },
  {
    id: 'science-easy-3',
    topicId: 'general-science',
    text: 'What is the largest organ in the human body?',
    options: ['Heart', 'Liver', 'Brain', 'Skin'],
    correctOption: 3,
    difficulty: 'easy',
    explanation: 'The skin is the largest organ in the human body, covering an area of about 2 square meters in adults.'
  },
  
  // General Science - Medium Questions
  {
    id: 'science-medium-1',
    topicId: 'general-science',
    text: 'What is the process by which plants make their own food using sunlight?',
    options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.'
  },
  {
    id: 'science-medium-2',
    topicId: 'general-science',
    text: 'Which of these is NOT a type of electromagnetic radiation?',
    options: ['X-rays', 'Gamma rays', 'Sound waves', 'Ultraviolet rays'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'Sound waves are mechanical waves that require a medium to travel through, unlike electromagnetic radiation which can travel through a vacuum.'
  },
  {
    id: 'science-medium-3',
    topicId: 'general-science',
    text: 'What is the main function of mitochondria in cells?',
    options: ['Protein synthesis', 'Energy production', 'Cell division', 'Waste removal'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Mitochondria are often referred to as the "powerhouse of the cell" because they generate most of the cell\'s supply of ATP (adenosine triphosphate), which is used as a source of energy.'
  },
  
  // General Science - Hard Questions
  {
    id: 'science-hard-1',
    topicId: 'general-science',
    text: 'Which of these particles has a negative charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Positron'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Electrons have a negative charge, protons have a positive charge, neutrons have no charge, and positrons (the antiparticle of electrons) have a positive charge.'
  },
  {
    id: 'science-hard-2',
    topicId: 'general-science',
    text: 'What is the name of the process by which a solid changes directly to a gas without passing through the liquid state?',
    options: ['Condensation', 'Sublimation', 'Deposition', 'Vaporization'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'Sublimation is the process by which a solid changes directly to a gas without passing through the liquid state, such as dry ice (solid carbon dioxide) changing to carbon dioxide gas.'
  },
  {
    id: 'science-hard-3',
    topicId: 'general-science',
    text: 'Which of these is NOT one of the four fundamental forces of nature?',
    options: ['Gravitational force', 'Electromagnetic force', 'Strong nuclear force', 'Centrifugal force'],
    correctOption: 3,
    difficulty: 'hard',
    explanation: 'The four fundamental forces of nature are gravitational, electromagnetic, strong nuclear, and weak nuclear forces. Centrifugal force is not a fundamental force but rather a fictitious or inertial force that appears in a rotating reference frame.'
  },
  
  // Computer Science - Easy Questions
  {
    id: 'cs-easy-1',
    topicId: 'computer-science',
    text: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Utility', 'Central Processor Utility'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'CPU stands for Central Processing Unit, which is the primary component of a computer that performs most of the processing.'
  },
  {
    id: 'cs-easy-2',
    topicId: 'computer-science',
    text: 'Which of these is NOT a programming language?',
    options: ['Java', 'Python', 'Microsoft', 'C++'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Microsoft is a technology company, not a programming language. Java, Python, and C++ are all programming languages.'
  },
  {
    id: 'cs-easy-3',
    topicId: 'computer-science',
    text: 'What does HTML stand for?',
    options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Hypertext Modern Links', 'High Transfer Markup Language'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'HTML stands for Hypertext Markup Language, which is the standard markup language for documents designed to be displayed in a web browser.'
  },
  
  // Computer Science - Medium Questions
  {
    id: 'cs-medium-1',
    topicId: 'computer-science',
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'Binary search has a time complexity of O(log n) because it repeatedly divides the search interval in half.'
  },
  {
    id: 'cs-medium-2',
    topicId: 'computer-science',
    text: 'Which data structure operates on a Last-In-First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Array'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'A stack operates on the Last-In-First-Out (LIFO) principle, where the last element added is the first one to be removed.'
  },
  {
    id: 'cs-medium-3',
    topicId: 'computer-science',
    text: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'SQL stands for Structured Query Language, which is used for managing and manipulating databases.'
  },
  
  // Computer Science - Hard Questions
  {
    id: 'cs-hard-1',
    topicId: 'computer-science',
    text: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Quick Sort has an average-case time complexity of O(n log n), which is better than Bubble Sort, Insertion Sort, and Selection Sort, which all have O(n²) time complexity.'
  },
  {
    id: 'cs-hard-2',
    topicId: 'computer-science',
    text: 'In object-oriented programming, what is the principle that allows a class to inherit properties and methods from another class?',
    options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Inheritance is the principle that allows a class to inherit properties and methods from another class, promoting code reuse and establishing a relationship between the parent class and the child class.'
  },
  {
    id: 'cs-hard-3',
    topicId: 'computer-science',
    text: 'What is the purpose of a virtual function in C++?',
    options: ['To create an instance of a class', 'To define a function without implementation', 'To allow function overriding in derived classes', 'To make a function private'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'A virtual function in C++ is used to allow function overriding in derived classes, enabling runtime polymorphism through the use of virtual function tables.'
  }
];

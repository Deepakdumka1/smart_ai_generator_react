export const basicCodingQuestions = [
  // Easy Questions
  {
    id: 'coding-easy-1',
    topicId: 'basic-coding',
    text: 'What is a variable in programming?',
    options: ['A fixed value', 'A container for storing data', 'A type of loop', 'A function'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'A variable is a named container that stores data which can be changed during program execution.'
  },
  {
    id: 'coding-easy-2',
    topicId: 'coding-basics',
    text: 'Which symbol is used for single-line comments in Python?',
    options: ['//', '<!-- -->', '#', '/* */'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'Python uses # for single-line comments.'
  },
  {
    id: 'coding-easy-3',
    topicId: 'coding-basics',
    text: 'Which of the following is a data type in JavaScript?',
    options: ['integer', 'num', 'boolean', 'real'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'JavaScript includes boolean to represent true/false.'
  },
  {
    id: 'coding-easy-4',
    topicId: 'coding-basics',
    text: 'What does CSS stand for?',
    options: ['Central Styling System', 'Creative Style Sheet', 'Cascading Style Sheets', 'Coding Style Sheet'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'CSS styles the layout and appearance of web pages.'
  },
  {
    id: 'coding-easy-5',
    topicId: 'coding-basics',
    text: 'Which of these is used to define a function in JavaScript?',
    options: ['function', 'def', 'fun', 'method'],
    correctOption: 0,
    difficulty: 'easy',
    explanation: 'JavaScript functions start with the function keyword.'
  },
  {
    id: 'coding-easy-6',
    topicId: 'coding-basics',
    text: 'In which language is print("Hello, world!") valid?',
    options: ['Java', 'C++', 'Python', 'HTML'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'This is the syntax for printing in Python.'
  },
  {
    id: 'coding-easy-7',
    topicId: 'coding-basics',
    text: 'What does == mean in most programming languages?',
    options: ['Assignment', 'Comparison', 'Addition', 'Not equal'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: '== checks if two values are equal.'
  },
  {
    id: 'coding-easy-8',
    topicId: 'coding-basics',
    text: 'What is the output of 2 + 3 * 4 in most programming languages?',
    options: ['20', '14', '24', '10'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: 'Multiplication has higher precedence, so it\'s 2 + (3×4).'
  },
  {
    id: 'coding-easy-9',
    topicId: 'coding-basics',
    text: 'Which tag is used to create a hyperlink in HTML?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctOption: 1,
    difficulty: 'easy',
    explanation: '<a> tag is used for hyperlinks.'
  },
  {
    id: 'coding-easy-10',
    topicId: 'coding-basics',
    text: 'Which language is best known for web development?',
    options: ['Python', 'C++', 'JavaScript', 'Java'],
    correctOption: 2,
    difficulty: 'easy',
    explanation: 'JavaScript is the main language for dynamic web content.'
  },

  // Medium Questions
  {
    id: 'coding-medium-1',
    topicId: 'coding-intermediate',
    text: 'Which keyword is used to define a class in Python?',
    options: ['function', 'class', 'object', 'struct'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'class defines a new class in Python.'
  },
  {
    id: 'coding-medium-2',
    topicId: 'coding-intermediate',
    text: 'What is the correct way to write a for loop in JavaScript?',
    options: ['for i to 10', 'for (i=0; i<10; i++)', 'for i = 1 to 10', 'foreach i in range(10)'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'That\'s the standard for loop in JavaScript.'
  },
  {
    id: 'coding-medium-3',
    topicId: 'coding-intermediate',
    text: 'What is the output of len("hello") in Python?',
    options: ['4', '5', '6', 'Error'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'len() returns the length of the string.'
  },
  {
    id: 'coding-medium-4',
    topicId: 'coding-intermediate',
    text: 'Which of the following is NOT a valid variable name in most languages?',
    options: ['_count', '2count', 'count2', 'count_2'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: 'Variables can\'t start with a digit.'
  },
  {
    id: 'coding-medium-5',
    topicId: 'coding-intermediate',
    text: 'What does git commit do?',
    options: ['Deletes code', 'Uploads files to GitHub', 'Saves changes to local repository', 'Clones a repository'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'git commit records changes in the local repo.'
  },
  {
    id: 'coding-medium-6',
    topicId: 'coding-intermediate',
    text: 'Which of the following is a backend language?',
    options: ['HTML', 'CSS', 'Python', 'XML'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'Python is commonly used for backend development.'
  },
  {
    id: 'coding-medium-7',
    topicId: 'coding-intermediate',
    text: 'Which function converts a string to an integer in Python?',
    options: ['parseInt()', 'toInt()', 'str()', 'int()'],
    correctOption: 3,
    difficulty: 'medium',
    explanation: 'int() converts a string to an integer.'
  },
  {
    id: 'coding-medium-8',
    topicId: 'coding-intermediate',
    text: 'What is the file extension for JavaScript files?',
    options: ['.js', '.java', '.jsc', '.jsx'],
    correctOption: 0,
    difficulty: 'medium',
    explanation: 'JavaScript files use the .js extension.'
  },
  {
    id: 'coding-medium-9',
    topicId: 'coding-intermediate',
    text: 'Which operator is used for exponentiation in Python?',
    options: ['^', '**', '//', '%%'],
    correctOption: 1,
    difficulty: 'medium',
    explanation: '** is the power operator in Python.'
  },
  {
    id: 'coding-medium-10',
    topicId: 'coding-intermediate',
    text: 'What is the use of the return statement in functions?',
    options: ['Exit loop', 'Exit program', 'Return a value', 'Print output'],
    correctOption: 2,
    difficulty: 'medium',
    explanation: 'return gives back a value from a function.'
  },

  // Hard Questions
  {
    id: 'coding-hard-1',
    topicId: 'coding-advanced',
    text: 'Which of the following is NOT a primitive data type in Java?',
    options: ['int', 'float', 'string', 'boolean'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'String is a class, not a primitive type.'
  },
  {
    id: 'coding-hard-2',
    topicId: 'coding-advanced',
    text: 'What will be the result of console.log(typeof NaN); in JavaScript?',
    options: ['NaN', 'number', 'undefined', 'object'],
    correctOption: 1,
    difficulty: 'hard',
    explanation: 'In JavaScript, NaN is considered a number.'
  },
  {
    id: 'coding-hard-3',
    topicId: 'coding-advanced',
    text: 'What is the time complexity of binary search in a sorted array?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Binary search halves the search space each step.'
  },
  {
    id: 'coding-hard-4',
    topicId: 'coding-advanced',
    text: 'What does this keyword refer to in JavaScript (non-arrow functions)?',
    options: ['The global object', 'The current function', 'The object that owns the method', 'Undefined'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'this refers to the object calling the method.'
  },
  {
    id: 'coding-hard-5',
    topicId: 'coding-advanced',
    text: 'Which method is used to add an element at the end of an array in JavaScript?',
    options: ['push()', 'append()', 'add()', 'insert()'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'push() adds elements to the end of an array.'
  },
  {
    id: 'coding-hard-6',
    topicId: 'coding-advanced',
    text: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble sort', 'Quick sort', 'Merge sort', 'Selection sort'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: 'Merge sort has O(n log n) time in all cases.'
  },
  {
    id: 'coding-hard-7',
    topicId: 'coding-advanced',
    text: 'Which Python keyword is used for exception handling?',
    options: ['try', 'handle', 'error', 'raiseError'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'try is used to catch exceptions.'
  },
  {
    id: 'coding-hard-8',
    topicId: 'coding-advanced',
    text: 'In SQL, what does the JOIN keyword do?',
    options: ['Combines rows from two or more tables', 'Creates a new table', 'Deletes a record', 'Adds a constraint'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'JOIN merges tables based on a related column.'
  },
  {
    id: 'coding-hard-9',
    topicId: 'coding-advanced',
    text: 'What is the result of True and False or True in Python?',
    options: ['True', 'False', 'Error', 'None'],
    correctOption: 0,
    difficulty: 'hard',
    explanation: 'Evaluates to (True and False) → False, then False or True → True.'
  },
  {
    id: 'coding-hard-10',
    topicId: 'coding-advanced',
    text: 'Which HTTP status code means "Not Found"?',
    options: ['200', '403', '404', '500'],
    correctOption: 2,
    difficulty: 'hard',
    explanation: '404 indicates the requested resource could not be found.'
  }
]; 
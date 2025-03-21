# Smart Quiz Generator

An AI-based personalized quiz application that adapts question difficulty based on student performance, tracks progress, and provides performance analysis and recommendations for further learning.

## Features

- **Adaptive Difficulty**: Questions adjust in difficulty based on whether the previous answer was correct or incorrect.
- **Progress Tracking**: The system tracks response time, accuracy, and mastery of topics.
- **Dynamic Questioning**: Utilizes algorithms to determine optimal difficulty progression.
- **Final Report**: Provides performance analysis at the end of the quiz, highlighting strengths and weaknesses.
- **Real-Time Feedback**: Offers hints and explanations to aid learning.
- **AI-Based Recommendations**: Suggests topics for further study based on performance.
- **Time-Based Adjustments**: Adjusts question difficulty based on response time.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

To build the app for production:

```bash
npm run build
```

This builds the app for production to the `build` folder, optimizing the build for the best performance.

## Project Structure

- **src**: Contains main application files including components, pages, and data.
  - **components**: Includes reusable components like Header, Footer, QuestionCard, ProgressBar, and ResultChart.
  - **pages**: Contains individual pages like Home, Topics, Quiz, Results, and NotFound.
  - **data**: Holds topics and questions data in separate files for easy management.
  - **utils**: Contains utility functions for quiz logic.

## Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-scripts**: 5.0.1
- **react-router-dom**: ^6.15.0
- **chart.js**: ^4.3.3
- **react-chartjs-2**: ^5.2.0
- **styled-components**: ^6.0.7

## How the Quiz Works

1. **Start the Quiz**: The student begins with a medium-difficulty question.
2. **Evaluate Answer**:
   - Correct Answer: The next question is slightly harder.
   - Incorrect Answer: The next question is slightly easier.
3. **Progress Tracking**: The system tracks response time, accuracy, and topic mastery.
4. **Adaptive Questioning**: Uses algorithms to determine optimal difficulty progression.
5. **Final Report**: At the end of the quiz, the system provides a performance analysis, identifying weak and strong areas.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

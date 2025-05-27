import { mathQuestions } from './math';
import { worldHistoryQuestions } from './worldHistory';
import { biologyQuestions } from './biology';
import { computerScienceQuestions } from './computerScience';
import { englishGrammarQuestions } from './englishGrammar';
import { geographyQuestions } from './geography';
import { physicsQuestions } from './physics';
import { literatureQuestions } from './literature';
import { basicCodingQuestions } from './basicCoding';
import { chemistryQuestions } from './chemistry';
import { ancientCivilizationsQuestions } from './ancientCivilizations';
import { generalScienceQuestions } from './generalScience';

// Combine all questions into a single array
export const questionsData = [
  ...mathQuestions,
  ...worldHistoryQuestions,
  ...biologyQuestions,
  ...computerScienceQuestions,
  ...englishGrammarQuestions,
  ...geographyQuestions,
  ...physicsQuestions,
  ...literatureQuestions,
  ...basicCodingQuestions,
  ...chemistryQuestions,
  ...ancientCivilizationsQuestions,
  ...generalScienceQuestions
];

// Export individual question sets
export {
  mathQuestions,
  worldHistoryQuestions,
  biologyQuestions,
  computerScienceQuestions,
  englishGrammarQuestions,
  geographyQuestions,
  physicsQuestions,
  literatureQuestions,
  basicCodingQuestions,
  chemistryQuestions,
  ancientCivilizationsQuestions,
  generalScienceQuestions
}; 
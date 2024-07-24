import { generateUniqueId } from './utils';
import { geneticVariables } from './geneticVariables';

// Function to generate a random genetic code for a creature
export const generateGeneticCode = (variables) => {
  return {
    id: generateUniqueId(),
    health: Math.floor(Math.random() * (variables.health.max - variables.health.min + 1)) + variables.health.min,
    velocity: {
      speed: Math.random() * (variables.speed.max - variables.speed.min) + variables.speed.min,
      direction: Math.random() * (variables.direction.max - variables.direction.min) + variables.direction.min,
    },
    vision: Math.random() * (variables.vision.max - variables.vision.min) + variables.vision.min,
    strength: Math.random() * (variables.strength.max - variables.strength.min) + variables.strength.min,
    neuralNetwork: [], // Placeholder for neural network weights
    x: Math.random() * 790,
    y: Math.random() * 590
  };
};

// Function to introduce random mutations in the genetic code
export const mutateGeneticCode = (geneticCode, mutationRate) => {
  const newGeneticCode = { ...geneticCode };
  console.log('Original genetic code:', newGeneticCode);

  Object.keys(newGeneticCode).forEach(property => {
    const randomNumber = Math.random();
    console.log(`Random number for ${property}:`, randomNumber);
    if (property !== 'id' && randomNumber < mutationRate) {
      console.log(`Selected ${property} for mutation with random number:`, randomNumber);
      if (typeof newGeneticCode[property] === 'object' && newGeneticCode[property] !== null) {
        if (geneticVariables[property]) {
          Object.keys(newGeneticCode[property]).forEach(subProperty => {
            if (geneticVariables[property][subProperty] !== undefined) {
              console.log(`Mutating ${property}.${subProperty}:`, newGeneticCode[property][subProperty]);
              newGeneticCode[property][subProperty] = Math.min(Math.max(
                newGeneticCode[property][subProperty] + (Math.random() - 0.5) * 0.1,
                geneticVariables[property][subProperty].min
              ), geneticVariables[property][subProperty].max);
              console.log(`New ${property}.${subProperty}:`, newGeneticCode[property][subProperty]);
            }
          });
        }
      } else {
        if (geneticVariables[property] !== undefined) {
          console.log(`Mutating ${property}:`, newGeneticCode[property]);
          newGeneticCode[property] = Math.min(Math.max(
            newGeneticCode[property] + (Math.random() - 0.5) * 0.1,
            geneticVariables[property].min
          ), geneticVariables[property].max);
          console.log(`New ${property}:`, newGeneticCode[property]);
        }
      }
    }
  });

  console.log('Mutated genetic code:', newGeneticCode);
  return newGeneticCode;
};

// Function to combine genetic codes from two parent creatures to produce offspring
export const crossoverGeneticCode = (parent1, parent2) => {
  const offspring = { ...parent1 };

  Object.keys(offspring).forEach(key => {
    if (key !== 'id') {
      if (typeof offspring[key] === 'object' && offspring[key] !== null) {
        Object.keys(offspring[key]).forEach(subKey => {
          offspring[key][subKey] = Math.random() > 0.5 ? parent1[key][subKey] : parent2[key][subKey];
        });
      } else {
        offspring[key] = Math.random() > 0.5 ? parent1[key] : parent2[key];
      }
    }
  });

  offspring.id = generateUniqueId();

  return offspring;
};

// Function to attempt reproduction and return offspring if successful
export const attemptReproduction = (creature, geneticCodes, mutationRate, reproductionRate) => {
  if (Math.random() < reproductionRate) {
    const parent2 = geneticCodes[Math.floor(Math.random() * geneticCodes.length)];
    const offspring = crossoverGeneticCode(creature, parent2);
    const mutatedOffspring = mutateGeneticCode(offspring, mutationRate);
    console.log(`Creature ${creature.id} reproduced with ${parent2.id}. Offspring: ${mutatedOffspring.id}`);
    return mutatedOffspring;
  }
  return null;
};

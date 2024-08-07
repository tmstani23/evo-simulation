//genetics/geneticCodeTemplate.js

import { generateUniqueId } from '../utils/generateUniqueId';
import normalizeDirection from '../utils/normalizeDirection';

// Function to generate a random genetic code
export const generateGeneticCode = (geneticVariables) => {
  const geneticCode = {
    id: generateUniqueId(),
    health: {
      current: Math.floor(Math.random() * (geneticVariables.health.max - geneticVariables.health.min + 1)) + geneticVariables.health.min,
      max: geneticVariables.health.max,
    },
    velocity: {
      speed: Math.random() * (geneticVariables.speed.max - geneticVariables.speed.min) + geneticVariables.speed.min,
      direction: normalizeDirection(Math.random() * 360), // Normalize initial direction
    },
    vision: Math.random() * (geneticVariables.vision.max - geneticVariables.vision.min) + geneticVariables.vision.min,
    strength: Math.random() * (geneticVariables.strength.max - geneticVariables.strength.min) + geneticVariables.strength.min,
    neuralNetwork: [],
    x: Math.random() * 790,
    y: Math.random() * 590,
  };
  console.log('Generated genetic code:', JSON.stringify(geneticCode));
  return geneticCode;
};

// Function to introduce random mutations in the genetic code
export const mutateGeneticCode = (geneticCode, mutationRate, variables) => {
  const newGeneticCode = { ...geneticCode };

  Object.keys(newGeneticCode).forEach(property => {
    const randomNumber = Math.random();
    if (property !== 'id' && randomNumber < mutationRate) {
      if (typeof newGeneticCode[property] === 'object' && newGeneticCode[property] !== null) {
        if (variables[property]) {
          Object.keys(newGeneticCode[property]).forEach(subProperty => {
            if (variables[property][subProperty] !== undefined) {
              newGeneticCode[property][subProperty] = Math.min(Math.max(
                newGeneticCode[property][subProperty] + (Math.random() - 0.5) * 0.05,
                variables[property][subProperty].min
              ), variables[property][subProperty].max);
            }
          });
        }
      } else {
        if (variables[property] !== undefined) {
          newGeneticCode[property] = Math.min(Math.max(
            newGeneticCode[property] + (Math.random() - 0.5) * 0.05,
            variables[property].min
          ), variables[property].max);
        }
      }
    }
  });

  // Ensure max is always valid
  if (newGeneticCode.health.max === undefined || isNaN(newGeneticCode.health.max)) {
    newGeneticCode.health.max = variables.health.max;
  }

  return newGeneticCode;
};

export const crossoverGeneticCode = (parent1, parent2, variables) => {
  const offspring = { ...parent1 };
  console.log(`Crossover parents: ${parent1.id}, ${parent2.id}`); // Debugging line

  Object.keys(offspring).forEach(key => {
    if (key !== 'id') {
      if (typeof offspring[key] === 'object' && offspring[key] !== null) {
        Object.keys(offspring[key]).forEach(subKey => {
          if (parent1[key] && parent2[key]) {
            offspring[key][subKey] = Math.random() > 0.5 ? parent1[key][subKey] : parent2[key][subKey];
            if (key === 'velocity' && variables[key] && variables[key][subKey] !== undefined) {
              offspring[key][subKey] = Math.max(Math.min(offspring[key][subKey] + (Math.random() - 0.5) * 0.05, variables[key][subKey].max), variables[key][subKey].min);
            }
          }
        });
      } else {
        offspring[key] = Math.random() > 0.5 ? parent1[key] : parent2[key];
      }
    }
  });

  // Ensure `velocity` is defined and initialized properly
  if (!offspring.velocity) {
    offspring.velocity = { speed: 0, direction: 0 }; // Default initialization
  }

  // Ensure direction is normalized
  offspring.velocity.direction = normalizeDirection(offspring.velocity.direction);

  return offspring;
};

// Function to attempt reproduction and return offspring if successful
export const attemptReproduction = (creature, population, mutationRate, reproductionRate, variables) => {
  if (Math.random() < reproductionRate) {
    const parent2 = population[Math.floor(Math.random() * population.length)];
    if (parent2.id !== creature.id) {  // Ensure different parents
      const offspringGeneticCode = crossoverGeneticCode(creature.geneticCode, parent2.geneticCode, variables);

      // Ensure unique ID for offspring genetic code
      offspringGeneticCode.id = generateUniqueId();

      // Slightly randomize position to avoid overlap
      const offset = 10; // Adjust as necessary to ensure no overlap
      offspringGeneticCode.x += (Math.random() - 0.5) * offset;
      offspringGeneticCode.y += (Math.random() - 0.5) * offset;

      // Ensure unique ID for offspring
      const offspringId = generateUniqueId();

      return {
        id: offspringId,
        geneticCode: offspringGeneticCode,
        health: { current: offspringGeneticCode.health.current, max: offspringGeneticCode.health.max },
        positionHistory: [],
        velocity: offspringGeneticCode.velocity,
        isOffspring: true,
      };
    }
  }
  return null;
};

import { generateUniqueId } from './utils';
import { geneticVariables, predatorGeneticVariables } from './geneticVariables';

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
      direction: Math.random() * (geneticVariables.direction.max - geneticVariables.direction.min) + geneticVariables.direction.min,
    },
    vision: Math.random() * (geneticVariables.vision.max - geneticVariables.vision.min) + geneticVariables.vision.min,
    strength: Math.random() * (geneticVariables.strength.max - geneticVariables.strength.min) + geneticVariables.strength.min,
    neuralNetwork: [],
    x: Math.random() * 790,
    y: Math.random() * 590,
  };
  console.log('Generated genetic code:', geneticCode);
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

  return newGeneticCode;
};

// Function to combine genetic codes from two parent creatures to produce offspring
export const crossoverGeneticCode = (parent1, parent2, variables) => {
  const offspring = { ...parent1 };

  Object.keys(offspring).forEach(key => {
    if (key !== 'id') {
      if (typeof offspring[key] === 'object' && offspring[key] !== null) {
        Object.keys(offspring[key]).forEach(subKey => {
          offspring[key][subKey] = Math.random() > 0.5 ? parent1[key][subKey] : parent2[key][subKey];
          if (key === 'velocity' && variables[key] && variables[key][subKey] !== undefined) {
            offspring[key][subKey] = Math.max(Math.min(offspring[key][subKey] + (Math.random() - 0.5) * 0.05, variables[key][subKey].max), variables[key][subKey].min); // Minimal random variation
          }
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
export const attemptReproduction = (creature, geneticCodes, mutationRate, reproductionRate, variables) => {
  if (Math.random() < reproductionRate) {
    const parent2 = geneticCodes[Math.floor(Math.random() * geneticCodes.length)];
    let offspring = crossoverGeneticCode(creature, parent2, variables);
    offspring = mutateGeneticCode(offspring, mutationRate, variables);

    // Calculate initial spawn position within a specified radius
    const radius = 10; // Example radius
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const distance = Math.random() * radius; // Random distance within radius

    let newX = creature.x + distance * Math.cos(angle);
    let newY = creature.y + distance * Math.sin(angle);

    // Ensure new position is within grid boundaries
    newX = Math.max(0, Math.min(newX, 790));
    newY = Math.max(0, Math.min(newY, 590));

    offspring.x = newX;
    offspring.y = newY;

    console.log(`Creature ${creature.id} reproduced with ${parent2.id}. Offspring: ${offspring.id} at (${offspring.x}, ${offspring.y})`);
    return offspring;
  }
  return null;
};

// Suppress unused variable warnings
console.log(geneticVariables);
console.log(predatorGeneticVariables);
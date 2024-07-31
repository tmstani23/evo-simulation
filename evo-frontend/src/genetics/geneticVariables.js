// geneticVariables.js
export const geneticVariables = {
  health: { min: 5, max: 100 },
  speed: { min: 1, max: 7 }, // Define the range for speed
  direction: { min: 0, max: 360 }, // Define the range for direction
  vision: { min: 1, max: 10 },
  strength: { min: 1, max: 10 },
};

export const predatorGeneticVariables = {
  health: { min: 5, max: 150 },
  speed: { min: 2, max: 10 }, // Updated max speed for predators
  direction: { min: 0, max: 360 },
  vision: { min: 5, max: 15 }, // Predators have better vision
  strength: { min: 5, max: 15 },
};

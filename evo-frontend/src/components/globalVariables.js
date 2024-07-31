const globalVariables = {
  // Prey variables
  mutationRate: 0.1,
  eatingRange: 10, // Range within which a creature can eat food
  foodHealthAmount: 30, // Increase health gained by eating food
  initialFoodCount: 150, // Initial number of food items
  foodRespawnRate: 5, // Number of food items to respawn each interval
  foodRespawnInterval: 1500, // Respawn food every 1.5 seconds
  creatureCount: 50, // Initial number of creatures
  healthLossPerIntervalPrey: 0.2, // Health loss per interval for prey
  reproductionRate: 0.004, // Probability of reproduction per interval for prey

  // Predator variables
  predatorReproductionRate: 0.002, // Probability of reproduction per interval for predators
  baseHealthLossFromPredator: 20, // Base health loss for prey when attacked by predators
  predatorHealthGain: 50, // Health gain for predators when they successfully consume prey
  initialPredatorCount: 10, // Initial number of predators
  predatorEatingRange: 15, // Range within which a predator can attack prey
  healthLossPerIntervalPredator: 0.9, // Health loss per interval for predators
};

export default globalVariables;

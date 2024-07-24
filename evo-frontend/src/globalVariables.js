const globalVariables = {
  mutationRate: 0.1,
  eatingRange: 10, // Range within which a creature can eat food
  foodHealthAmount: 30, // Increase health gained by eating food
  initialFoodCount: 150, // Initial number of food items
  foodRespawnRate: 10, // Number of food items to respawn each interval
  foodRespawnInterval: 1000, // Respawn food every 1 seconds
  creatureCount: 50, // Initial number of creatures
  healthLossPerInterval: 0.05, // Reduce health lost per interval
};

export default globalVariables;

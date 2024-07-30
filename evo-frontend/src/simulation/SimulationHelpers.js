// Import global variables to use them in helper functions
import globalVariables from '../components/globalVariables';


// Helper function to calculate the movement of a creature or predator
export const calculateMovement = (entity) => {
    const speed = entity.velocity.speed; // Get the speed of the entity
    const direction = entity.velocity.direction; // Get the direction of the entity
  
    // Validate speed and direction to ensure they are numbers
    if (typeof speed !== 'number' || typeof direction !== 'number') {
      console.error('Invalid speed or direction:', speed, direction);
      return { deltaX: 0, deltaY: 0 };
    }
  
    // Convert the direction from degrees to radians for trigonometric calculations
    const angle = direction * (Math.PI / 180);
    const deltaX = speed * Math.cos(angle); // Calculate the change in X position
    const deltaY = speed * Math.sin(angle); // Calculate the change in Y position
  
    return { deltaX, deltaY }; // Return the calculated changes in position
  };
  
  // Helper function to detect if a creature is close to food and handle consumption
  export const detectProximityToFood = (creature, foodItemsRef, setFoodItems) => {
    const eatingRange = globalVariables.eatingRange; // Get the range within which the creature can eat food
    let foodEaten = false;
  
    // Filter the food items to find ones that are close enough to be eaten
    const updatedFoodItems = foodItemsRef.current.filter((food, index) => {
      const distance = Math.sqrt((creature.x - food.x) ** 2 + (creature.y - food.y) ** 2); // Calculate the distance to the food
      if (distance < eatingRange) {
        console.log(`Creature ${creature.id} eating food at (${food.x}, ${food.y})`);
        foodEaten = true;
        return false; // Remove the food item if it is eaten
      }
      return true; // Keep the food item if it is not eaten
    });
  
    if (foodEaten) {
      foodItemsRef.current = updatedFoodItems; // Update the reference with the remaining food items
      setFoodItems([...updatedFoodItems]); // Update the state with the remaining food items
      console.log("Updated food items after consumption:", updatedFoodItems.length);
      return globalVariables.foodHealthAmount; // Return the health gain from eating the food
    }
    return 0; // Return 0 if no food was eaten
  };
  
  // Helper function to detect if a predator is close to prey and handle consumption
  export const detectProximityToPrey = (predator, geneticCodesRef, setGeneticCodes) => {
    const eatingRange = globalVariables.predatorEatingRange; // Get the range within which the predator can eat prey
    let preyEaten = false;
  
    // Filter the genetic codes to find creatures that are close enough to be eaten
    const updatedGeneticCodes = geneticCodesRef.current.filter((creature, index) => {
      const distance = Math.sqrt((predator.x - creature.x) ** 2 + (predator.y - creature.y) ** 2); // Calculate the distance to the prey
      if (distance < eatingRange) {
        console.log(`Predator ${predator.id} attacking prey at (${creature.x}, ${creature.y})`);
        const healthLoss = globalVariables.baseHealthLossFromPredator + (predator.strength - creature.strength); // Calculate the health loss to the prey
        if (creature.health <= healthLoss) {
          console.log(`Predator ${predator.id} consumed prey ${creature.id}`);
          preyEaten = true;
          return false; // Remove the prey if it is eaten
        } else {
          creature.health -= healthLoss; // Reduce the health of the prey if it is not completely eaten
        }
      }
      return true; // Keep the prey if it is not eaten
    });
  
    if (preyEaten) {
      geneticCodesRef.current = updatedGeneticCodes; // Update the reference with the remaining genetic codes
      setGeneticCodes([...updatedGeneticCodes]); // Update the state with the remaining genetic codes
      console.log("Updated prey items after consumption:", updatedGeneticCodes.length);
      return globalVariables.predatorHealthGain; // Return the health gain from eating the prey
    }
    return 0; // Return 0 if no prey was eaten
  };
  
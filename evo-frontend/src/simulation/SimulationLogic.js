import { generateGeneticCode } from '../genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from '../genetics/geneticVariables';

// Function to start the simulation
export const startSimulation = (setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables) => {
  console.log('Starting simulation with global variables:', globalVariables);

  // Logic to start the simulation
intervalRef.current = setInterval(() => {
    // Update genetic codes
    setGeneticCodes(prevGeneticCodes => {
      const updatedGeneticCodes = prevGeneticCodes.map(creature => {
        const deltaX = creature.velocity.speed * Math.cos(creature.velocity.direction * Math.PI / 180);
        const deltaY = creature.velocity.speed * Math.sin(creature.velocity.direction * Math.PI / 180);
        let newX = creature.x + deltaX;
        let newY = creature.y + deltaY;
  
        // Check for wall collisions and adjust direction if necessary
        if (newX < 0 || newX > 790) {
          creature.velocity.direction = 180 - creature.velocity.direction;
          newX = Math.max(0, Math.min(newX, 790));
        }
        if (newY < 0 || newY > 590) {
          creature.velocity.direction = 360 - creature.velocity.direction;
          newY = Math.max(0, Math.min(newY, 590));
        }
  
        creature.x = newX;
        creature.y = newY;
        return creature;
      });
      geneticCodesRef.current = updatedGeneticCodes;
      return updatedGeneticCodes;
    });
  
    // Update predator codes
    setPredatorCodes(prevPredatorCodes => {
      const updatedPredatorCodes = prevPredatorCodes.map(predator => {
        const deltaX = predator.velocity.speed * Math.cos(predator.velocity.direction * Math.PI / 180);
        const deltaY = predator.velocity.speed * Math.sin(predator.velocity.direction * Math.PI / 180);
        let newX = predator.x + deltaX;
        let newY = predator.y + deltaY;
  
        // Check for wall collisions and adjust direction if necessary
        if (newX < 0 || newX > 790) {
          predator.velocity.direction = 180 - predator.velocity.direction;
          newX = Math.max(0, Math.min(newX, 790));
        }
        if (newY < 0 || newY > 590) {
          predator.velocity.direction = 360 - predator.velocity.direction;
          newY = Math.max(0, Math.min(newY, 590));
        }
  
        predator.x = newX;
        predator.y = newY;
        return predator;
      });
      predatorCodesRef.current = updatedPredatorCodes;
      return updatedPredatorCodes;
    });
  
    // Update food items
    setFoodItems(prevFoodItems => {
      const updatedFoodItems = prevFoodItems.map(food => food);
      foodItemsRef.current = updatedFoodItems;
      return updatedFoodItems;
    });
  }, 135); //simulation speed m/s

  // Logic to handle food respawn
  foodIntervalRef.current = setInterval(() => {
    setFoodItems(prevFoodItems => {
      const newFoodItems = Array.from({ length: globalVariables.foodRespawnRate }, () => ({
        x: Math.random() * 790,
        y: Math.random() * 590,
      }));
      const updatedFoodItems = [...prevFoodItems, ...newFoodItems];
      foodItemsRef.current = updatedFoodItems;
      return updatedFoodItems;
    });
  }, globalVariables.foodRespawnInterval);
};

// Function to stop the simulation
export const stopSimulation = (intervalRef, foodIntervalRef) => {
  clearInterval(intervalRef.current);
  clearInterval(foodIntervalRef.current);
};

// Function to reset the simulation
export const resetSimulation = (setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables) => {
  const newGeneticCodes = Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables));
  const newPredatorCodes = Array.from({ length: globalVariables.initialPredatorCount }, () => generateGeneticCode(predatorGeneticVariables));
  const newFoodItems = Array.from({ length: globalVariables.initialFoodCount }, () => ({
    x: Math.random() * 790,
    y: Math.random() * 590,
  }));
  setGeneticCodes(newGeneticCodes);
  setPredatorCodes(newPredatorCodes);
  setFoodItems(newFoodItems);
  geneticCodesRef.current = newGeneticCodes;
  predatorCodesRef.current = newPredatorCodes;
  foodItemsRef.current = newFoodItems;
  stopSimulation(intervalRef, foodIntervalRef);
};

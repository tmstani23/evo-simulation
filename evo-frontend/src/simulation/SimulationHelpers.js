// simulation/SimulationHelpers.js

import { attemptReproduction } from '../genetics/geneticCodeTemplate';

// Function to calculate movement based on genetic code
export const calculateMovement = (geneticCode) => {
  const { speed, direction } = geneticCode.velocity;
  const radians = (Math.PI / 180) * direction; // Convert direction to radians
  const deltaX = speed * Math.cos(radians);
  const deltaY = speed * Math.sin(radians);
  return { deltaX, deltaY };
};

// Helper function to detect if a creature is close to food and handle consumption
export const detectProximityToFood = (setGeneticCodes, geneticCodesRef, setFoodItems, foodItemsRef, globalVariables) => {
  setGeneticCodes(prevGeneticCodes => {
    const updatedGeneticCodes = prevGeneticCodes.map(creature => {
      const closeFood = foodItemsRef.current.find(food => {
        const distance = Math.sqrt(Math.pow(creature.geneticCode.x - food.x, 2) + Math.pow(creature.geneticCode.y - food.y, 2));
        return distance < globalVariables.eatingRange;
      });

      if (closeFood) {
        creature.geneticCode.health.current = Math.min(creature.geneticCode.health.current + globalVariables.foodHealthAmount, creature.geneticCode.health.max);
        setFoodItems(prevFoodItems => prevFoodItems.filter(food => food !== closeFood));
      }

      return creature;
    });
    geneticCodesRef.current = updatedGeneticCodes;
    return updatedGeneticCodes;
  });
};

// Helper function to detect proximity to prey
export const detectProximityToPrey = (setPredatorCodes, predatorCodesRef, setGeneticCodes, geneticCodesRef, globalVariables) => {
  setPredatorCodes(prevPredatorCodes => {
    const updatedPredatorCodes = prevPredatorCodes.map(predator => {
      const closePrey = geneticCodesRef.current.find(creature => {
        const distance = Math.sqrt(Math.pow(predator.geneticCode.x - creature.geneticCode.x, 2) + Math.pow(predator.geneticCode.y - creature.geneticCode.y, 2));
        return distance < globalVariables.predatorEatingRange;
      });

      if (closePrey) {
        predator.health.current = Math.min(predator.health.current + globalVariables.predatorHealthGain, predator.health.max);
        closePrey.geneticCode.health.current -= globalVariables.baseHealthLossFromPredator;
        if (closePrey.geneticCode.health.current <= 0) {
          setGeneticCodes(prevGeneticCodes => prevGeneticCodes.filter(creature => creature !== closePrey));
        }
      }

      return predator;
    });
    predatorCodesRef.current = updatedPredatorCodes;
    return updatedPredatorCodes;
  });
};

// Helper function to handle reproduction for both prey and predators
export const handleReproduction = (geneticCodes, geneticCodesRef, mutationRate, reproductionRate, variables) => {
  const newGeneticCodes = geneticCodes.slice();
  geneticCodes.forEach(creature => {
    const offspring = attemptReproduction(creature, geneticCodes, mutationRate, reproductionRate, variables);
    if (offspring) {
      newGeneticCodes.push(offspring);
    }
  });
  geneticCodesRef.current = newGeneticCodes;
  return newGeneticCodes;
};

// Helper function to apply health loss
export const applyHealthLoss = (entities, healthLossPerInterval) => {
  return entities.map(entity => {
    entity.health.current -= healthLossPerInterval;
    if (entity.health.current < 0) {
      entity.health.current = 0;
    }
    return entity;
  });
};

// Function to add position history
export const addPositionHistory = (creature, position) => {
  if (!creature.positionHistory) {
    creature.positionHistory = [];
  }
  if (position && position.x != null && position.y != null) { // Ensure no null positions are added
    creature.positionHistory.push(position);
    // Optional: Limit history length to avoid memory issues
    if (creature.positionHistory.length > 1000) {
      creature.positionHistory.shift();
    }
  }
};

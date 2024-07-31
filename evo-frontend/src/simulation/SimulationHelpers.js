// Import global variables to use them in helper functions
import globalVariables from '../components/globalVariables';
import { attemptReproduction } from '../genetics/geneticCodeTemplate';
import { geneticVariables } from '../genetics/geneticVariables';

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

// Helper function to handle reproduction
export const handleReproduction = (setGeneticCodes, geneticCodesRef, globalVariables) => {
  setGeneticCodes(prevGeneticCodes => {
    const newGeneticCodes = prevGeneticCodes.slice();
    prevGeneticCodes.forEach(creature => {
      const offspring = attemptReproduction(creature, prevGeneticCodes, globalVariables.mutationRate, globalVariables.reproductionRate, geneticVariables);
      if (offspring) {
        newGeneticCodes.push(offspring);
      }
    });
    geneticCodesRef.current = newGeneticCodes;
    return newGeneticCodes;
  });
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

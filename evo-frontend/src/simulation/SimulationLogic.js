// simulation/SimulationLogic.js

import { attemptReproduction } from '../genetics/geneticCodeTemplate';
import { generateGeneticCode } from '../genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from '../genetics/geneticVariables';
import { calculateMovement, detectProximityToFood, detectProximityToPrey, applyHealthLoss, addPositionHistory } from './SimulationHelpers';
import { generateUniqueId } from '../utils/generateUniqueId';
import normalizeDirection from '../utils/normalizeDirection';

// Function to start the simulation
export const startSimulation = (setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables, gridDimensions) => {
  console.log('Starting simulation with global variables:', JSON.stringify(globalVariables));

  intervalRef.current = setInterval(() => {
    setGeneticCodes(prevGeneticCodes => {
      const updatedGeneticCodes = applyHealthLoss(prevGeneticCodes, globalVariables.healthLossPerIntervalPrey)
        .map(creature => {
          const newCreature = { ...creature, geneticCode: { ...creature.geneticCode, velocity: { ...creature.geneticCode.velocity } } };
          const { deltaX, deltaY } = calculateMovement(newCreature.geneticCode);
          let newX = newCreature.geneticCode.x + deltaX;
          let newY = newCreature.geneticCode.y + deltaY;
          let newDirection = normalizeDirection(newCreature.geneticCode.velocity.direction);

          // Ensure the new direction is normalized
          newCreature.geneticCode.velocity.direction = newDirection;

          console.log(`Creature ID: ${creature.id}, newX: ${newX}, newY: ${newY}, gridWidth: ${gridDimensions.width}, gridHeight: ${gridDimensions.height}`);

          // Update the condition checks for right and bottom boundaries
          if (newX < 0 || newX >= gridDimensions.width) {
            console.log(`Creature ID: ${creature.id} hit the vertical boundary`);
            newDirection = normalizeDirection(180 - newCreature.geneticCode.velocity.direction);
            newX = Math.max(0, Math.min(newX, gridDimensions.width - 1));
            newCreature.geneticCode.velocity.direction = newDirection;
          }
          if (newY < 0 || newY >= gridDimensions.height) {
            console.log(`Creature ID: ${creature.id} hit the horizontal boundary`);
            newDirection = normalizeDirection(360 - newCreature.geneticCode.velocity.direction);
            newY = Math.max(0, Math.min(newY, gridDimensions.height - 1));
            newCreature.geneticCode.velocity.direction = newDirection;
          }

          newCreature.geneticCode.x = newX;
          newCreature.geneticCode.y = newY;

          // Add position to history
          addPositionHistory(newCreature, { x: newX, y: newY });

          return newCreature;
        })
        .filter(creature => creature.health.current > 0);

      const newGeneticCodes = updatedGeneticCodes.slice();
      updatedGeneticCodes.forEach(creature => {
        const offspring = attemptReproduction(creature, updatedGeneticCodes, globalVariables.mutationRate, globalVariables.reproductionRate, geneticVariables);
        if (offspring) {
          newGeneticCodes.push(offspring);
        }
      });

      geneticCodesRef.current = newGeneticCodes;
      return newGeneticCodes;
    });

    setPredatorCodes(prevPredatorCodes => {
      const updatedPredatorCodes = applyHealthLoss(prevPredatorCodes, globalVariables.healthLossPerIntervalPredator)
        .map(predator => {
          const newPredator = { ...predator, geneticCode: { ...predator.geneticCode, velocity: { ...predator.geneticCode.velocity } } };
          const { deltaX, deltaY } = calculateMovement(newPredator.geneticCode);
          let newX = newPredator.geneticCode.x + deltaX;
          let newY = newPredator.geneticCode.y + deltaY;
          let newDirection = normalizeDirection(newPredator.geneticCode.velocity.direction);

          // Ensure the new direction is normalized
          newPredator.geneticCode.velocity.direction = newDirection;

          console.log(`Predator ID: ${predator.id}, newX: ${newX}, newY: ${newY}, gridWidth: ${gridDimensions.width}, gridHeight: ${gridDimensions.height}`);

          // Update the condition checks for right and bottom boundaries
          if (newX < 0 || newX >= gridDimensions.width) {
            console.log(`Predator ID: ${predator.id} hit the vertical boundary`);
            newDirection = normalizeDirection(180 - newPredator.geneticCode.velocity.direction);
            newX = Math.max(0, Math.min(newX, gridDimensions.width - 1));
            newPredator.geneticCode.velocity.direction = newDirection;
          }
          if (newY < 0 || newY >= gridDimensions.height) {
            console.log(`Predator ID: ${predator.id} hit the horizontal boundary`);
            newDirection = normalizeDirection(360 - newPredator.geneticCode.velocity.direction);
            newY = Math.max(0, Math.min(newY, gridDimensions.height - 1));
            newPredator.geneticCode.velocity.direction = newDirection;
          }

          newPredator.geneticCode.x = newX;
          newPredator.geneticCode.y = newY;

          // Add position to history
          addPositionHistory(newPredator, { x: newX, y: newY });

          return newPredator;
        })
        .filter(predator => predator.health.current > 0);

      const newPredatorCodes = updatedPredatorCodes.slice();
      updatedPredatorCodes.forEach(predator => {
        const offspring = attemptReproduction(predator, updatedPredatorCodes, globalVariables.mutationRate, globalVariables.predatorReproductionRate, predatorGeneticVariables);
        if (offspring) {
          newPredatorCodes.push(offspring);
        }
      });

      predatorCodesRef.current = newPredatorCodes;
      return newPredatorCodes;
    });

    detectProximityToFood(setGeneticCodes, geneticCodesRef, setFoodItems, foodItemsRef, globalVariables);
    detectProximityToPrey(setPredatorCodes, predatorCodesRef, setGeneticCodes, geneticCodesRef, globalVariables);

  }, 135);

  foodIntervalRef.current = setInterval(() => {
    setFoodItems(prevFoodItems => {
      const newFoodItems = Array.from({ length: globalVariables.foodRespawnRate }, () => ({
        id: generateUniqueId(),
        x: Math.random() * gridDimensions.width,
        y: Math.random() * gridDimensions.height,
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
export const resetSimulation = (setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables, gridDimensions) => {
  const newGeneticCodes = Array.from({ length: globalVariables.creatureCount }, () => ({
    id: generateUniqueId(),
    geneticCode: generateGeneticCode(geneticVariables),
    health: { current: Math.floor(Math.random() * (geneticVariables.health.max - geneticVariables.health.min + 1)) + geneticVariables.health.min, max: geneticVariables.health.max }
  }));
  const newPredatorCodes = Array.from({ length: globalVariables.initialPredatorCount }, () => ({
    id: generateUniqueId(),
    geneticCode: generateGeneticCode(predatorGeneticVariables),
    health: { current: Math.floor(Math.random() * (predatorGeneticVariables.health.max - geneticVariables.health.min + 1)) + predatorGeneticVariables.health.min, max: predatorGeneticVariables.health.max }
  }));
  const newFoodItems = Array.from({ length: globalVariables.initialFoodCount }, () => ({
    id: generateUniqueId(),
    x: Math.random() * gridDimensions.width,
    y: Math.random() * gridDimensions.height,
  }));
  setGeneticCodes(newGeneticCodes);
  setPredatorCodes(newPredatorCodes);
  setFoodItems(newFoodItems);
  geneticCodesRef.current = newGeneticCodes;
  predatorCodesRef.current = newPredatorCodes;
  foodItemsRef.current = newFoodItems;
  stopSimulation(intervalRef, foodIntervalRef);
};

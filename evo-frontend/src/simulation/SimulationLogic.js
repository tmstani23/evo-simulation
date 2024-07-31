// File: simulation/SimulationLogic.js

import { generateGeneticCode } from '../genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from '../genetics/geneticVariables';
import globalVariables from '../components/globalVariables';
import { calculateMovement, detectProximityToFood, detectProximityToPrey, handleReproduction, applyHealthLoss } from './SimulationHelpers';

// Function to start the simulation
export const startSimulation = (setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables) => {
  console.log('Starting simulation with global variables:', globalVariables);

  intervalRef.current = setInterval(() => {
    setGeneticCodes(prevGeneticCodes => {
      const updatedGeneticCodes = applyHealthLoss(prevGeneticCodes, globalVariables.healthLossPerIntervalPrey)
        .map(creature => {
          const { deltaX, deltaY } = calculateMovement(creature.geneticCode);
          let newX = creature.geneticCode.x + deltaX;
          let newY = creature.geneticCode.y + deltaY;

          if (newX < 0 || newX > 790) {
            creature.geneticCode.velocity.direction = 180 - creature.geneticCode.velocity.direction;
            newX = Math.max(0, Math.min(newX, 790));
          }
          if (newY < 0 || newY > 590) {
            creature.geneticCode.velocity.direction = 360 - creature.geneticCode.velocity.direction;
            newY = Math.max(0, Math.min(newY, 590));
          }

          creature.geneticCode.x = newX;
          creature.geneticCode.y = newY;
          return creature;
        })
        .filter(creature => creature.health.current > 0);

      geneticCodesRef.current = updatedGeneticCodes;
      return updatedGeneticCodes;
    });

    setPredatorCodes(prevPredatorCodes => {
      const updatedPredatorCodes = applyHealthLoss(prevPredatorCodes, globalVariables.healthLossPerIntervalPredator)
        .map(predator => {
          const { deltaX, deltaY } = calculateMovement(predator.geneticCode);
          let newX = predator.geneticCode.x + deltaX;
          let newY = predator.geneticCode.y + deltaY;

          if (newX < 0 || newX > 790) {
            predator.geneticCode.velocity.direction = 180 - predator.geneticCode.velocity.direction;
            newX = Math.max(0, Math.min(newX, 790));
          }
          if (newY < 0 || newY > 590) {
            predator.geneticCode.velocity.direction = 360 - predator.geneticCode.velocity.direction;
            newY = Math.max(0, Math.min(newY, 590));
          }

          predator.geneticCode.x = newX;
          predator.geneticCode.y = newY;
          return predator;
        })
        .filter(predator => predator.health.current > 0);

      predatorCodesRef.current = updatedPredatorCodes;
      return updatedPredatorCodes;
    });

    setFoodItems(prevFoodItems => {
      const updatedFoodItems = prevFoodItems.map(food => food);
      foodItemsRef.current = updatedFoodItems;
      return updatedFoodItems;
    });

    detectProximityToFood(setGeneticCodes, geneticCodesRef, setFoodItems, foodItemsRef, globalVariables);
    detectProximityToPrey(setPredatorCodes, predatorCodesRef, setGeneticCodes, geneticCodesRef, globalVariables);

  }, 135);

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
  const newGeneticCodes = Array.from({ length: globalVariables.creatureCount }, () => ({
    geneticCode: generateGeneticCode(geneticVariables),
    health: { current: Math.floor(Math.random() * (geneticVariables.health.max - geneticVariables.health.min + 1)) + geneticVariables.health.min, max: geneticVariables.health.max }
  }));
  const newPredatorCodes = Array.from({ length: globalVariables.initialPredatorCount }, () => ({
    geneticCode: generateGeneticCode(predatorGeneticVariables),
    health: { current: Math.floor(Math.random() * (predatorGeneticVariables.health.max - predatorGeneticVariables.health.min + 1)) + predatorGeneticVariables.health.min, max: predatorGeneticVariables.health.max }
  }));
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

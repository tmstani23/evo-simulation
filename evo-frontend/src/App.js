import React, { useState, useEffect, useRef } from 'react';
import { generateGeneticCode, attemptReproduction } from './genetics/geneticCodeTemplate';
import { geneticVariables } from './genetics/geneticVariables';
import globalVariables from './globalVariables';
import Grid from './components/Grid';
import './App.css'; // Import global CSS file

const App = () => {
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables)));
  const [foodItems, setFoodItems] = useState(Array.from({ length: globalVariables.initialFoodCount }, () => ({
    x: Math.random() * 790,
    y: Math.random() * 590,
  })));
  const [debugMode, setDebugMode] = useState(false); // Add debug mode state
  const geneticCodesRef = useRef(geneticCodes);
  const foodItemsRef = useRef(foodItems);
  const intervalRef = useRef(null);
  const foodIntervalRef = useRef(null); // Interval for food respawn

  const toggleDebugMode = () => setDebugMode(!debugMode); // Toggle debug mode

  const resetSimulation = () => {
    const newGeneticCodes = Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables));
    const newFoodItems = Array.from({ length: globalVariables.initialFoodCount }, () => ({
      x: Math.random() * 790,
      y: Math.random() * 590,
    }));
    setGeneticCodes(newGeneticCodes);
    setFoodItems(newFoodItems);
    geneticCodesRef.current = newGeneticCodes;
    foodItemsRef.current = newFoodItems;
    clearInterval(intervalRef.current); // Clear the simulation interval
    clearInterval(foodIntervalRef.current); // Clear the food respawn interval
    console.log("Simulation reset");
  };

  const calculateMovement = (creature) => {
    const speed = creature.velocity.speed;
    const direction = creature.velocity.direction;

    if (typeof speed !== 'number' || typeof direction !== 'number') {
      console.error('Invalid speed or direction:', speed, direction);
      return { deltaX: 0, deltaY: 0 };
    }

    const angle = direction * (Math.PI / 180); // Convert to radians
    const deltaX = speed * Math.cos(angle);
    const deltaY = speed * Math.sin(angle);

    return { deltaX, deltaY };
  };

  const detectProximityToFood = (creature) => {
    const eatingRange = globalVariables.eatingRange;
    let foodEaten = false;
    const updatedFoodItems = foodItemsRef.current.filter((food, index) => {
      const distance = Math.sqrt((creature.x - food.x) ** 2 + (creature.y - food.y) ** 2);
      if (distance < eatingRange) {
        console.log(`Creature ${creature.id} eating food at (${food.x}, ${food.y})`);
        foodEaten = true;
        return false; // Remove food item
      }
      return true;
    });

    if (foodEaten) {
      foodItemsRef.current = updatedFoodItems;
      setFoodItems([...updatedFoodItems]);
      console.log("Updated food items after consumption:", updatedFoodItems.length);
      return globalVariables.foodHealthAmount;
    }
    return 0;
  };

  const respawnFood = () => {
    console.log("Respawning food");
    for (let i = 0; i < globalVariables.foodRespawnRate; i++) {
      const newFood = {
        x: Math.random() * 790,
        y: Math.random() * 590,
      };
      foodItemsRef.current.push(newFood);
    }
    setFoodItems([...foodItemsRef.current]);
    console.log("Current food items:", foodItemsRef.current.length);
  };

  const startSimulation = () => {
    console.log("Starting simulation");
    // Start the simulation interval
    intervalRef.current = setInterval(() => {
      setGeneticCodes((prevGeneticCodes) => {
        const updatedCodes = prevGeneticCodes.map((creature) => {
          let { deltaX, deltaY } = calculateMovement(creature);

          let newX = creature.x + deltaX;
          let newY = creature.y + deltaY;

          if (newX <= 0 || newX >= 790) {
            creature.velocity.direction = 180 - creature.velocity.direction;
            deltaX = -deltaX;
            newX = creature.x + deltaX;
          }

          if (newY <= 0 || newY >= 590) {
            creature.velocity.direction = 360 - creature.velocity.direction;
            deltaY = -deltaY;
            newY = creature.y + deltaY;
          }

          const healthGain = detectProximityToFood(creature);
          const oldHealth = creature.health;
          const newHealth = creature.health - globalVariables.healthLossPerInterval + healthGain;
          if (healthGain > 0) {
            console.log(`Creature ${creature.id} gained health from eating. Health before: ${oldHealth}, Health after: ${newHealth}`);
          }

          return {
            ...creature,
            x: Math.max(0, Math.min(newX, 790)),
            y: Math.max(0, Math.min(newY, 590)),
            health: newHealth,
          };
        }).filter(creature => creature.health > 0);

        const newCreatures = [];
        for (let creature of updatedCodes) {
          const offspring = attemptReproduction(creature, geneticCodesRef.current, globalVariables.mutationRate, globalVariables.reproductionRate);
          if (offspring) {
            newCreatures.push(offspring);
          }
        }

        const finalGeneticCodes = [...updatedCodes, ...newCreatures];
        geneticCodesRef.current = finalGeneticCodes;
        return finalGeneticCodes;
      });
    }, 100);

    // Start the food respawn interval
    foodIntervalRef.current = setInterval(() => {
      console.log("Calling respawnFood");
      respawnFood();
    }, globalVariables.foodRespawnInterval);
    console.log("Food respawn interval set");
  };

  const stopSimulation = () => {
    console.log("Stopping simulation");
    clearInterval(intervalRef.current); // Clear the simulation interval
    clearInterval(foodIntervalRef.current); // Clear the food respawn interval
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(foodIntervalRef.current); // Clear the food respawn interval
    };
  }, []);

  return (
    <div className="app-container">
      <div className="grid-container">
        <Grid creatures={geneticCodes} foodItems={foodItems} debugMode={debugMode} />
      </div>
      <div className="controls-container">
        <button onClick={startSimulation}>Start Simulation</button>
        <button onClick={stopSimulation}>Stop Simulation</button>
        <button onClick={resetSimulation}>Reset Simulation</button>
        <button onClick={toggleDebugMode}>Toggle Debug Mode</button>
      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { generateGeneticCode, attemptReproduction } from './genetics/geneticCodeTemplate';
import { geneticVariables } from './genetics/geneticVariables';
import globalVariables from './globalVariables';
import Grid from './components/Grid';
import GlobalVariablesSliders from './components/GlobalVariablesSliders'; // Import the new component
import './App.css'; // Import global CSS file

const App = () => {
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables)));
  const [foodItems, setFoodItems] = useState(Array.from({ length: globalVariables.initialFoodCount }, () => ({
    x: Math.random() * 790,
    y: Math.random() * 590,
  })));
  const [debugMode, setDebugMode] = useState(false); // Add debug mode state
  const [isRunning, setIsRunning] = useState(false); // State to check if simulation is running
  const [variables, setVariables] = useState(globalVariables); // State to manage global variables
  const geneticCodesRef = useRef(geneticCodes);
  const foodItemsRef = useRef(foodItems);
  const intervalRef = useRef(null);
  const foodIntervalRef = useRef(null); // Interval for food respawn

  const toggleDebugMode = () => setDebugMode(!debugMode); // Toggle debug mode

  const resetSimulation = () => {
    const newGeneticCodes = Array.from({ length: variables.creatureCount }, () => generateGeneticCode(geneticVariables));
    const newFoodItems = Array.from({ length: variables.initialFoodCount }, () => ({
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
    const eatingRange = variables.eatingRange;
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
      return variables.foodHealthAmount;
    }
    return 0;
  };

  const respawnFood = () => {
    console.log("Respawning food");
    for (let i = 0; i < variables.foodRespawnRate; i++) {
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
    setIsRunning(true); // Set simulation running state
    console.log("Starting simulation");
    // Start the simulation interval
    intervalRef.current = setInterval(() => {
      setGeneticCodes((prevGeneticCodes) => {
        const updatedCodes = prevGeneticCodes.map((creature) => {
          let { deltaX, deltaY } = calculateMovement(creature);

          let newX = creature.x + deltaX;
          let newY = creature.y + deltaY;
          let newDirection = creature.velocity.direction; // Maintain current direction

          if (newX <= 0 || newX >= 790) {
            newDirection = 180 - newDirection; // Reflect direction on x-axis collision
            deltaX = -deltaX;
            newX = creature.x + deltaX;
          }

          if (newY <= 0 || newY >= 590) {
            newDirection = 360 - newDirection; // Reflect direction on y-axis collision
            deltaY = -deltaY;
            newY = creature.y + deltaY;
          }

          const healthGain = detectProximityToFood(creature);
          const newHealth = creature.health - variables.healthLossPerInterval + healthGain;

          return {
            ...creature,
            x: Math.max(0, Math.min(newX, 790)),
            y: Math.max(0, Math.min(newY, 590)),
            health: newHealth,
            velocity: {
              ...creature.velocity,
              direction: newDirection // Update direction only if it has changed
            }
          };
        }).filter(creature => creature.health > 0);

        const newCreatures = [];
        for (let creature of updatedCodes) {
          const offspring = attemptReproduction(creature, geneticCodesRef.current, variables.mutationRate, variables.reproductionRate);
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
    }, variables.foodRespawnInterval);
    console.log("Food respawn interval set");
  };

  const stopSimulation = () => {
    setIsRunning(false); // Set simulation running state
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
      <header className="app-header">
        <h1>Evolution Simulator</h1>
      </header>
      <div className="main-content">
        <div className="grid-container">
          <Grid creatures={geneticCodes} foodItems={foodItems} debugMode={debugMode} />
        </div>
        <div className="controls-container">
          <button onClick={startSimulation} disabled={isRunning}>Start Simulation</button>
          <button onClick={stopSimulation} disabled={!isRunning}>Stop Simulation</button>
          <button onClick={resetSimulation}>Reset Simulation</button>
          <button onClick={toggleDebugMode}>Toggle Debug Mode</button>
        </div>
        {!isRunning && (
          <GlobalVariablesSliders 
            globalVariables={variables} 
            setGlobalVariables={setVariables} 
            disabled={isRunning} 
          />
        )}
      </div>
      <footer className="app-footer">
        <p>&copy; 2024 Evolution Simulator</p>
      </footer>
    </div>
  );
};

export default App;

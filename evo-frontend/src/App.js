import React, { useState, useEffect, useRef } from 'react';
import { generateGeneticCode, attemptReproduction } from './genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from './genetics/geneticVariables';
import globalVariables from './globalVariables';
import Grid from './components/Grid';
import './App.css'; // Import global CSS file

const App = () => {
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables)));
  const [predatorCodes, setPredatorCodes] = useState(Array.from({ length: globalVariables.initialPredatorCount }, () => generateGeneticCode(predatorGeneticVariables)));
  const [foodItems, setFoodItems] = useState(Array.from({ length: globalVariables.initialFoodCount }, () => ({
    x: Math.random() * 790,
    y: Math.random() * 590,
  })));
  const [debugMode, setDebugMode] = useState(false); // Add debug mode state
  const geneticCodesRef = useRef(geneticCodes);
  const predatorCodesRef = useRef(predatorCodes);
  const foodItemsRef = useRef(foodItems);
  const intervalRef = useRef(null);
  const foodIntervalRef = useRef(null); // Interval for food respawn

  const toggleDebugMode = () => setDebugMode(!debugMode); // Toggle debug mode

  const resetSimulation = () => {
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
    clearInterval(intervalRef.current); // Clear the simulation interval
    clearInterval(foodIntervalRef.current); // Clear the food respawn interval
    console.log("Simulation reset");
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
          const newHealth = Math.min(creature.health - globalVariables.healthLossPerInterval + healthGain, geneticVariables.health.max);
          if (healthGain > 0) {
            console.log(`Creature ${creature.id} gained health from eating. Health before: ${oldHealth}, Health after: ${newHealth}`);
          }

          return {
            ...creature,
            x: Math.max(0, Math.min(newX, 790)),
            y: Math.max(0, Math.min(newY, 590)),
            health: newHealth,
          };
        }).filter(creature => {
          if (creature.health <= 0) {
            console.log(`Creature ${creature.id} removed due to health <= 0`);
            return false;
          }
          return true;
        });

        const newCreatures = [];
        for (let creature of updatedCodes) {
          const offspring = attemptReproduction(creature, geneticCodesRef.current, globalVariables.mutationRate, globalVariables.reproductionRate, geneticVariables);
          if (offspring) {
            newCreatures.push(offspring);
          }
        }

        const finalGeneticCodes = [...updatedCodes, ...newCreatures];
        geneticCodesRef.current = finalGeneticCodes;
        return finalGeneticCodes;
      });

      setPredatorCodes((prevPredatorCodes) => {
        const updatedPredators = prevPredatorCodes.map((predator) => {
          let { deltaX, deltaY } = calculateMovement(predator);

          let newX = predator.x + deltaX;
          let newY = predator.y + deltaY;

          if (newX <= 0 || newX >= 790) {
            predator.velocity.direction = 180 - predator.velocity.direction;
            deltaX = -deltaX;
            newX = predator.x + deltaX;
          }

          if (newY <= 0 || newY >= 590) {
            predator.velocity.direction = 360 - predator.velocity.direction;
            deltaY = -deltaY;
            newY = predator.y + deltaY;
          }

          const healthGain = detectProximityToPrey(predator);
          const oldHealth = predator.health;
          const newHealth = Math.min(predator.health - globalVariables.predatorHealthLossPerInterval + healthGain, predatorGeneticVariables.health.max);
          if (healthGain > 0) {
            console.log(`Predator ${predator.id} gained health from eating. Health before: ${oldHealth}, Health after: ${newHealth}`);
          }

          return {
            ...predator,
            x: Math.max(0, Math.min(newX, 790)),
            y: Math.max(0, Math.min(newY, 590)),
            health: newHealth,
          };
        }).filter(predator => {
          if (predator.health <= 0) {
            console.log(`Predator ${predator.id} removed due to health <= 0`);
            return false;
          }
          return true;
        });

        const newPredators = [];
        for (let predator of updatedPredators) {
          const offspring = attemptReproduction(predator, predatorCodesRef.current, globalVariables.mutationRate, globalVariables.predatorReproductionRate, predatorGeneticVariables);
          if (offspring) {
            newPredators.push(offspring);
          }
        }

        const finalPredatorCodes = [...updatedPredators, ...newPredators];
        predatorCodesRef.current = finalPredatorCodes;
        return finalPredatorCodes;
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

  const detectProximityToPrey = (predator) => {
    const eatingRange = globalVariables.predatorEatingRange;
    let preyEaten = false;
    const updatedGeneticCodes = geneticCodesRef.current.filter((creature, index) => {
      const distance = Math.sqrt((predator.x - creature.x) ** 2 + (predator.y - creature.y) ** 2);
      if (distance < eatingRange) {
        console.log(`Predator ${predator.id} attacking prey at (${creature.x}, ${creature.y})`);
        const healthLoss = globalVariables.baseHealthLossFromPredator + (predator.strength - creature.strength);
        if (creature.health <= healthLoss) {
          console.log(`Predator ${predator.id} consumed prey ${creature.id}`);
          preyEaten = true;
          return false; // Remove prey item
        } else {
          creature.health -= healthLoss;
        }
      }
      return true;
    });

    if (preyEaten) {
      geneticCodesRef.current = updatedGeneticCodes;
      setGeneticCodes([...updatedGeneticCodes]);
      console.log("Updated prey items after consumption:", updatedGeneticCodes.length);
      return globalVariables.predatorHealthGain;
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

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(foodIntervalRef.current); // Clear the food respawn interval
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">Simulation Header</header>
      <div className="main-content">
        <div className="grid-container">
          <Grid creatures={geneticCodes} predators={predatorCodes} foodItems={foodItems} debugMode={debugMode} />
        </div>
        <div className="controls-container">
          <button onClick={startSimulation}>Start Simulation</button>
          <button onClick={stopSimulation}>Stop Simulation</button>
          <button onClick={resetSimulation}>Reset Simulation</button>
          <button onClick={toggleDebugMode}>Toggle Debug Mode</button>
        </div>
      </div>
      <footer className="app-footer">Simulation Footer</footer>
    </div>
  );
};

export default App;
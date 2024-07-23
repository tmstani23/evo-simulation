import React, { useState, useEffect, useRef } from 'react';
import { generateGeneticCode } from './genetics/geneticCodeTemplate';
import { geneticVariables } from './genetics/geneticVariables';
import globalVariables from './globalVariables'; // Import global variables
import GridContainer from './components/GridContainer'; // Import the GridContainer component

const App = () => {
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables)));
  const [foodItems, setFoodItems] = useState(Array.from({ length: globalVariables.initialFoodCount }, () => ({
    x: Math.random() * 790, // Random x-coordinate
    y: Math.random() * 590, // Random y-coordinate
  })));
  const [isRunning, setIsRunning] = useState(false); // Simulation state
  const geneticCodesRef = useRef(geneticCodes);
  const foodItemsRef = useRef(foodItems);
  const intervalRef = useRef(null);

  const regenerateGeneticCodes = () => {
    const newGeneticCodes = Array.from({ length: globalVariables.creatureCount }, () => generateGeneticCode(geneticVariables));
    setGeneticCodes(newGeneticCodes);
    geneticCodesRef.current = newGeneticCodes;
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

    console.log('Movement deltas:', deltaX, deltaY);
    return { deltaX, deltaY };
  };

  const detectProximityToFood = (creature) => {
    const eatingRange = globalVariables.eatingRange; // Use global variable
    for (let i = 0; i < foodItemsRef.current.length; i++) {
      const food = foodItemsRef.current[i];
      const distance = Math.sqrt((creature.x - food.x) ** 2 + (creature.y - food.y) ** 2);
      if (distance < eatingRange) {
        // Creature eats the food
        foodItemsRef.current.splice(i, 1); // Remove the food item
        return globalVariables.foodHealthAmount; // Return health gain from eating food
      }
    }
    return 0; // No food eaten
  };

  const respawnFood = () => {
    const newFood = {
      x: Math.random() * 790,
      y: Math.random() * 590
    };
    foodItemsRef.current.push(newFood);
    setFoodItems([...foodItemsRef.current]); // Update the state to trigger re-render
  };

  const startSimulation = () => {
    setIsRunning(true);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        console.log('Updating genetic codes...');
        const updatedCodes = geneticCodesRef.current.map((creature) => {
          let { deltaX, deltaY } = calculateMovement(creature);

          let newX = creature.x + deltaX;
          let newY = creature.y + deltaY;

          // Boundary checks and direction adjustments
          if (newX <= 0 || newX >= 790) {
            creature.velocity.direction = 180 - creature.velocity.direction; // Invert direction
            deltaX = -deltaX; // Invert deltaX
            newX = creature.x + deltaX; // Recalculate newX
          }

          if (newY <= 0 || newY >= 590) {
            creature.velocity.direction = 360 - creature.velocity.direction; // Invert direction
            deltaY = -deltaY; // Invert deltaY
            newY = creature.y + deltaY; // Recalculate newY
          }

          console.log('Creature position:', creature.x, creature.y);
          console.log('New position:', newX, newY);
          console.log('Creature health:', creature.health);

          // Detect proximity to food and consume if close enough
          const healthGain = detectProximityToFood(creature);
          const newHealth = creature.health - 1 + healthGain;

          return {
            ...creature,
            x: Math.max(0, Math.min(newX, 790)),
            y: Math.max(0, Math.min(newY, 590)),
            health: newHealth,
          };
        }).filter(creature => creature.health > 0); // Remove creatures with zero or negative health

        // Respawn food if any were consumed
        if (foodItemsRef.current.length < globalVariables.foodRespawnRate) {
          respawnFood();
        }

        setGeneticCodes(updatedCodes);
        geneticCodesRef.current = updatedCodes;
      }, 100); // Update every 100 milliseconds
    } else {
      // Clear the interval when the simulation stops
      clearInterval(intervalRef.current);
    }

    // Cleanup function to clear interval on component unmount or when isRunning changes
    return () => {
      console.log('Clearing interval...');
      clearInterval(intervalRef.current);
    };
  }, [isRunning]); // Depend on isRunning state

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button onClick={regenerateGeneticCodes}>Regenerate Genetic Codes</button>
          <span> - Generates new genetic codes based on the current variables.</span>
        </div>

        <div style={{ width: '800px', height: '600px', position: 'relative', overflow: 'hidden' }}>
          <h2>Simulation</h2>
          <GridContainer creatures={geneticCodes} foodItems={foodItems} />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={startSimulation}>Start Simulation</button>
        <button onClick={stopSimulation}>Stop Simulation</button>
      </div>
    </div>
  );
};

export default App;

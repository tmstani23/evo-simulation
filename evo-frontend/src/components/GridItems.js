import React from 'react';

// Function to calculate the size of a creature or predator based on its health
const getSizeFromHealth = (health, minSize, maxSize, minHealth, maxHealth) => {
  return ((health - minHealth) / (maxHealth - minHealth)) * (maxSize - minSize) + minSize;
};

// Component to render a food item on the grid
export const FoodItem = ({ food }) => (
  <div className="food" style={{ left: `${food.x}px`, top: `${food.y}px` }}></div>
);

// Component to render a creature on the grid
export const Creature = ({ creature, debugMode }) => {
  const size = getSizeFromHealth(creature.health, 5, 20, 0, 100); // Calculate size based on health
  return (
    <div
      className="creature"
      style={{
        left: `${creature.x}px`,
        top: `${creature.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#e74c3c', // Color for creatures
        position: 'absolute', // Ensure the creature is positioned absolutely
        borderRadius: '50%', // Ensure the creature is a circle
      }}
    >
      {debugMode && (
        <>
          {/* Arrow indicating direction and speed */}
          <div
            className="arrow"
            style={{
              width: `${creature.velocity.speed * 10}px`,
              transform: `rotate(${creature.velocity.direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
          {/* Circle indicating the creature's vision range */}
          <div
            className="vision"
            style={{
              width: `${creature.vision * creature.strength * 2}px`,
              height: `${creature.vision * creature.strength * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        </>
      )}
    </div>
  );
};

// Component to render a predator on the grid
export const Predator = ({ predator, debugMode }) => {
  const size = getSizeFromHealth(predator.health, 5, 20, 50, 150); // Calculate size based on health, same as creatures
  const direction = predator.velocity.direction;

  console.log(`Predator ID: ${predator.id}, Position: (${predator.x}, ${predator.y}), Direction: ${direction}`);

  return (
    <div
      className="creature" // Use the same class as creatures for consistency
      style={{
        left: `${predator.x}px`,
        top: `${predator.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#3498db', // Light blue color for predators
        position: 'absolute', // Ensure the predator is positioned absolutely
        borderRadius: '50%', // Ensure the predator is a circle
      }}
    >
      {debugMode && (
        <>
          {/* Arrow indicating direction and speed */}
          <div
            className="arrow"
            style={{
              width: `${predator.velocity.speed * 10}px`,
              transform: `rotate(${direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
          {/* Circle indicating the predator's vision range */}
          <div
            className="vision"
            style={{
              width: `${predator.vision * predator.strength * 2}px`,
              height: `${predator.vision * predator.strength * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        </>
      )}
    </div>
  );
};

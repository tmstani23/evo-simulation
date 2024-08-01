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
  const size = getSizeFromHealth(creature.health.current, 5, 20, 0, 100); // Calculate size based on health
  const { x, y, velocity, vision, strength } = creature.geneticCode;
  const backgroundColor = creature.isOffspring ? '#ff9999' : '#e74c3c'; // Lighter red for offspring

  return (
    <div
      className="creature"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor, // Set background color based on isOffspring
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
              width: `${velocity.speed * 10}px`,
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
          {/* Circle indicating the creature's vision range */}
          <div
            className="vision"
            style={{
              width: `${vision * strength * 2}px`,
              height: `${vision * strength * 2}px`,
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
  const size = getSizeFromHealth(predator.health.current, 5, 20, 50, 150); // Calculate size based on health
  const { x, y, velocity, vision, strength } = predator.geneticCode;
  const backgroundColor = predator.isOffspring ? '#00008B' : '#3498db'; // Darker blue for offspring

  return (
    <div
      className="creature" // Use the same class as creatures for consistency
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor, // Set background color based on isOffspring
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
              width: `${velocity.speed * 10}px`,
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
          {/* Circle indicating the predator's vision range */}
          <div
            className="vision"
            style={{
              width: `${vision * strength * 2}px`,
              height: `${vision * strength * 2}px`,
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
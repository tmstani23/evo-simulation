import React from 'react';

// Function to calculate the size of a creature or predator based on its health
const getSizeFromHealth = (health, minSize, maxSize, minHealth, maxHealth) => {
  return ((health - minHealth) / (maxHealth - minHealth)) * (maxSize - minSize) + minSize;
};

// Component to render a food item on the grid
export const FoodItem = ({ food }) => (
  <div className="food" style={{ left: `${food.x}px`, top: `${food.y}px` }}></div>
);

export const Creature = ({ creature, debugMode, onClick, onMouseEnter, onMouseLeave, onMouseMove, isHovered }) => {
  const size = getSizeFromHealth(creature.health.current, 5, 20, 0, 100);
  const { x, y, velocity, vision, strength } = creature.geneticCode;
  const backgroundColor = creature.isOffspring ? '#ff9999' : '#e74c3c';

  return (
    <div
      className={`creature ${isHovered ? 'hovered' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        position: 'absolute',
        borderRadius: '50%',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {debugMode && velocity && (
        <>
          <div
            className="arrow"
            style={{
              width: `${velocity.speed * 10}px`,
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
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

// Predator Component
export const Predator = ({ predator, debugMode, onClick, onMouseEnter, onMouseLeave, onMouseMove, isHovered }) => {
  const size = getSizeFromHealth(predator.health.current, 5, 20, 50, 150);
  const { x, y, velocity, vision, strength } = predator.geneticCode;
  const backgroundColor = predator.isOffspring ? '#add8e6' : '#3498db';

  return (
    <div
      className={`creature predator ${isHovered ? 'hovered' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        position: 'absolute',
        borderRadius: '50%',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {debugMode && velocity && (
        <>
          <div
            className="arrow"
            style={{
              width: `${velocity.speed * 10}px`,
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
            }}
          ></div>
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

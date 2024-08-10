import React from 'react';

// Function to calculate the size of a creature or predator based on its health
const getSizeFromHealth = (health, minSize, maxSize, minHealth, maxHealth) => {
  return ((health - minHealth) / (maxHealth - minHealth)) * (maxSize - minSize) + minSize;
};

// Component to render a food item on the grid
export const FoodItem = ({ food }) => (
  <div className="absolute w-2 h-2 bg-[#FFA500]" style={{ left: `${food.x}px`, top: `${food.y}px` }}></div>
);

export const Creature = ({ creature, debugMode, onClick, onMouseEnter, onMouseLeave, onMouseMove, isHovered }) => {
  const size = getSizeFromHealth(creature.health.current, 5, 20, 0, 100);
  const { x, y, velocity, vision, strength } = creature.geneticCode;
  const backgroundColor = creature.isOffspring ? 'bg-[#ccf7f7]' : 'bg-[#00d1d1]';

  return (
    <div
      className={`absolute rounded-full ${backgroundColor} ${isHovered ? 'hover:bg-[#00b3b3]' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {debugMode && velocity && (
        <>
          <div
            className="absolute bg-blue-500"
            style={{
              width: `${velocity.speed * 10}px`,
              height: `${strength * 0.5}px`, // Increase the proportion factor for arrow width
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
              left: '50%',
              top: '50%',
            }}
          ></div>
          <div
            className="absolute border border-yellow-400 rounded-full"
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
  const backgroundColor = predator.isOffspring ? 'bg-[#f7ccf7]' : 'bg-[#d100d1]';

  return (
    <div
      className={`absolute rounded-full ${backgroundColor} ${isHovered ? 'hover:bg-[#b300b3]' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {debugMode && velocity && (
        <>
          <div
            className="absolute bg-blue-500"
            style={{
              width: `${velocity.speed * 10}px`,
              height: `${strength * 0.5}px`, // Increase the proportion factor for arrow width
              transform: `rotate(${velocity.direction}deg)`,
              transformOrigin: '0% 50%',
              left: '50%',
              top: '50%',
            }}
          ></div>
          <div
            className="absolute border border-yellow-400 rounded-full"
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

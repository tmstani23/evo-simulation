// Grid.js
import React from 'react';
import '../App.css'; // Ensure the path is correct relative to the components folder

const getSizeFromHealth = (health, minSize, maxSize, minHealth, maxHealth) => {
  return ((health - minHealth) / (maxHealth - minHealth)) * (maxSize - minSize) + minSize;
};

const Grid = React.memo(({ creatures, foodItems, debugMode }) => {
  console.log('Grid re-rendered'); // Log re-renders

  return (
    <div className="grid-content">
      {foodItems.map((food, index) => (
        <div key={index} className="food" style={{ left: `${food.x}px`, top: `${food.y}px` }}></div>
      ))}
      {creatures.map((creature) => {
        const size = getSizeFromHealth(creature.health, 5, 20, 0, 100); // Adjust the size range as needed
        return (
          <div
            key={creature.id}
            className="creature"
            style={{
              left: `${creature.x}px`,
              top: `${creature.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: '#e74c3c', // Ensure consistent color
              position: 'absolute', // Ensure creatures are positioned absolutely
            }}
          >
            {debugMode && (
              <>
                <div
                  className="arrow"
                  style={{
                    width: `${creature.velocity.speed * 10}px`,
                    transform: `rotate(${creature.velocity.direction}deg)`,
                  }}
                ></div>
                <div
                  className="vision"
                  style={{
                    width: `${creature.vision * creature.strength * 2}px`,
                    height: `${creature.vision * creature.strength * 2}px`,
                    left: `50%`,
                    top: `50%`,
                    transform: `translate(-50%, -50%)`,
                  }}
                ></div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default Grid;

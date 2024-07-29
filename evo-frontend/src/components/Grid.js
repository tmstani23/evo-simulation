import React from 'react';
import '../App.css'; // Ensure the path is correct relative to the components folder

const getSizeFromHealth = (health, minSize, maxSize, minHealth, maxHealth) => {
  return ((health - minHealth) / (maxHealth - minHealth)) * (maxSize - minSize) + minSize;
};

const Grid = React.memo(({ creatures, predators, foodItems, debugMode }) => {
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
      {predators.map((predator) => {
        const size = getSizeFromHealth(predator.health, 10, 30, 50, 150); // Adjust the size range as needed
        const borderSize = size / 2; // Adjust border size based on health
        return (
          <div
            key={predator.id}
            className="predator"
            style={{
              left: `${predator.x}px`,
              top: `${predator.y}px`,
              borderLeft: `${borderSize}px solid transparent`,
              borderRight: `${borderSize}px solid transparent`,
              borderBottom: `${size}px solid #3498db`, // Blue color for predators
              position: 'absolute', // Ensure predators are positioned absolutely
            }}
          >
            {debugMode && (
              <>
                <div
                  className="arrow"
                  style={{
                    width: `${predator.velocity.speed * 10}px`,
                    transform: `rotate(${predator.velocity.direction}deg)`,
                  }}
                ></div>
                <div
                  className="vision"
                  style={{
                    width: `${predator.vision * predator.strength * 2}px`,
                    height: `${predator.vision * predator.strength * 2}px`,
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

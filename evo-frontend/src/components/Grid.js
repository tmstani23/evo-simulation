import React from 'react';
import './Grid.css'; // Ensure the styles are correctly imported

const Grid = React.memo(({ creatures, foodItems, debugMode }) => {
  console.log('Grid re-rendered'); // Log re-renders

  return (
    <div className="grid-container">
      {foodItems.map((food, index) => (
        <div key={index} className="food" style={{ left: food.x, top: food.y }}></div>
      ))}
      {creatures.map((creature) => (
        <div
          key={creature.id}
          className="creature"
          style={{
            left: creature.x,
            top: creature.y,
            width: `${creature.strength * 2}px`,
            height: `${creature.strength * 2}px`,
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
      ))}
    </div>
  );
});

export default Grid;

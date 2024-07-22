// src/components/Grid.js

import React from 'react';
import './Grid.css';

const Grid = React.memo(({ creatures, foodItems }) => {
  console.log('Grid re-rendered'); // Log re-renders

  return (
    <div className="grid-container">
      {creatures.map((creature) => (
        <div
          key={creature.id}
          className="creature"
          style={{
            left: creature.x,
            top: creature.y,
            backgroundColor: 'blue',
            width: 10,
            height: 10,
            position: 'absolute' // Ensure creatures are positioned absolutely
          }}
        />
      ))}
      {foodItems.map((food, index) => (
        <div
          key={index}
          className="food"
          style={{
            left: food.x,
            top: food.y,
            backgroundColor: 'green',
            width: 10,
            height: 10,
            position: 'absolute' // Ensure food items are positioned absolutely
          }}
        />
      ))}
    </div>
  );
});

export default Grid;

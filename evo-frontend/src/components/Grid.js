import React from 'react';
import { FoodItem, Creature, Predator } from './GridItems';

const Grid = ({ creatures, predators, foodItems, debugMode }) => {
  console.log('Rendering Grid with creatures:', creatures);
  console.log('Rendering Grid with predators:', predators);

  return (
    <div className="grid-content">
      {foodItems.map(food => (
        <FoodItem key={food.id} food={food} />
      ))}
      {creatures.map(creature => (
        <Creature key={creature.id} creature={creature} debugMode={debugMode} />
      ))}
      {predators.map(predator => (
        <Predator key={predator.id} predator={predator} debugMode={debugMode} />
      ))}
    </div>
  );
};

export default Grid;

import React from 'react';
import { Creature, Predator, FoodItem } from './GridItems';

//components/Grid.js

const Grid = ({ creatures, predators, foodItems, debugMode, onClickCreature }) => {
  return (
    <div className="grid">
      {creatures.map(creature => (
        <Creature
          key={creature.id}
          creature={creature}
          debugMode={debugMode}
          onClick={() => onClickCreature(creature)}
        />
      ))}
      {predators.map(predator => (
        <Predator
          key={predator.id}
          predator={predator}
          debugMode={debugMode}
          onClick={() => onClickCreature(predator)}
        />
      ))}
      {foodItems.map(food => (
        <FoodItem key={food.id} food={food} />
      ))}
    </div>
  );
};

export default Grid;

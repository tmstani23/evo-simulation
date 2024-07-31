// File: components/Grid.js

import React from 'react';
import { Creature, Predator, FoodItem } from './GridItems';
import '../App.css'; // Ensure the path is correct relative to the components folder

const Grid = ({ creatures, predators, foodItems, debugMode }) => {
  console.log('Creatures:', creatures);
  console.log('Predators:', predators);
  console.log('Food Items:', foodItems);

  return (
    <div className="grid-content">
      {foodItems.map((food, index) => <FoodItem key={index} food={food} />)}
      {creatures.map((creature) => <Creature key={creature.id} creature={creature} debugMode={debugMode} />)}
      {predators.map((predator) => <Predator key={predator.id} predator={predator} debugMode={debugMode} />)}
    </div>
  );
};

export default Grid;

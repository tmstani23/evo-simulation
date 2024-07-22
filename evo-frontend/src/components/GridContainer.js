// src/components/GridContainer.js

import React from 'react';
import './GridContainer.css';
import Grid from './Grid';

const GridContainer = ({ creatures, foodItems }) => {
  return (
    <div className="grid-container">
      <Grid creatures={creatures} foodItems={foodItems} />
    </div>
  );
};

export default GridContainer; // Ensure default export

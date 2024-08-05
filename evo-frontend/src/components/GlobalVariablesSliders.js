import React, { useState } from 'react';

//components/GlobalVariablesSliders.js

const GlobalVariablesSliders = ({ globalVariables, setGlobalVariables, disabled }) => {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showRestartMessage, setShowRestartMessage] = useState(false); // Track if a slider was adjusted

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setGlobalVariables(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
    setShowRestartMessage(true); // Show message when slider is adjusted
    console.log(`Updated ${name} to ${value}`);
  };

  const handleMouseEnter = (e) => {
    if (disabled) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({ top: rect.top - 30, left: rect.left + rect.width / 2 });
      setTooltip('Can only adjust parameters while simulation is stopped');
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const variableLabels = {
    mutationRate: 'Mutation Rate',
    eatingRange: 'Creature Eating Range',
    foodHealthAmount: 'Food Health Amount',
    initialFoodCount: 'Initial Food Count',
    foodRespawnRate: 'Food Respawn Rate',
    foodRespawnInterval: 'Food Respawn Interval',
    creatureCount: 'Creature Count',
    healthLossPerIntervalPrey: 'Health Loss Per Interval (Creatures)',
    reproductionRate: 'Creature Reproduction Rate',
    predatorReproductionRate: 'Predator Reproduction Rate',
    baseHealthLossFromPredator: 'Prey Health Loss From Pred Attack',
    predatorHealthGain: 'Predator Health Gain From Attack',
    initialPredatorCount: 'Initial Predator Count',
    predatorEatingRange: 'Predator Eating Range',
    healthLossPerIntervalPredator: 'Health Loss Per Interval (Predator)'
  };

  return (
    <div className="sliders-container">
      {showRestartMessage && !disabled && <div className="restart-message">Restart the simulation to apply the new settings.</div>}
      {Object.keys(globalVariables).map((key) => {
        // Define min, max, and step values based on the specific global variable
        let min, max, step;
        switch (key) {
          case 'mutationRate':
            min = 0.01; max = 0.1; step = 0.01; // Mutation rate range: 1% to 10%
            break;
          case 'eatingRange':
            min = 1; max = 50; step = 1; // Eating range: 1 to 50 units
            break;
          case 'foodHealthAmount':
            min = 10; max = 100; step = 1; // Health gained from food: 10 to 100 units
            break;
          case 'initialFoodCount':
            min = 10; max = 300; step = 1; // Initial number of food items: 10 to 300
            break;
          case 'foodRespawnRate':
            min = 1; max = 50; step = 1; // Food respawn amount: 1 to 50 items per interval
            break;
          case 'foodRespawnInterval':
            min = 500; max = 5000; step = 100; // Food respawn interval: 500 to 5000 milliseconds
            break;
          case 'creatureCount':
            min = 10; max = 100; step = 1; // Initial number of creatures: 10 to 100
            break;
          case 'healthLossPerIntervalPrey':
            min = 0.01; max = 0.2; step = 0.01; // Health loss per interval: 0.01 to 0.2 units
            break;
          case 'reproductionRate':
            min = 0.001; max = 0.005; step = 0.001; // Adjust reproduction rate: 0.1% to 0.5%
            break;
          case 'predatorReproductionRate':
            min = 0.001; max = 0.005; step = 0.001; // Adjust predator reproduction rate: 0.1% to 0.5%
            break;
          case 'baseHealthLossFromPredator':
            min = 10; max = 100; step = 1; // Amount of health damage predators do to prey: 10 to 100 units
            break;
          case 'predatorHealthGain':
            min = 10; max = 100; step = 1; // Predator health gain: 10 to 100 units
            break;
          case 'initialPredatorCount':
            min = 1; max = 50; step = 1; // Initial number of predators: 1 to 50
            break;
          case 'predatorEatingRange':
            min = 1; max = 50; step = 1; // Predator eating range: 1 to 50 units
            break;
          case 'healthLossPerIntervalPredator':
            min = 0.01; max = 0.2; step = 0.01; // Predator health loss per interval: 0.01 to 0.2 units
            break;
          default:
            min = 0; max = 10; step = 1; // Default range for unspecified variables
            break;
        }

        return (
          <div key={key} className="slider-control" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <label htmlFor={key}>
              {`${variableLabels[key]}: ${globalVariables[key]}`}
            </label>
            <input
              type="range"
              id={key}
              name={key}
              min={min}
              max={max}
              step={step}
              value={globalVariables[key]}
              onChange={handleSliderChange}
              disabled={disabled}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        );
      })}
      {tooltip && <div className="tooltip" style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}>{tooltip}</div>}
    </div>
  );
};

export default GlobalVariablesSliders;

import React, { useState } from 'react';

const GlobalVariablesSliders = ({ globalVariables, setGlobalVariables, disabled }) => {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showRestartMessage, setShowRestartMessage] = useState(false);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setGlobalVariables(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
    setShowRestartMessage(true);
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
    <div className="w-full lg:w-1/2 p-4 bg-gray-800 text-white rounded-lg mx-auto">
      {showRestartMessage && !disabled && <div className="restart-message text-center mb-4 p-2 bg-yellow-500 rounded">Restart the simulation to apply the new settings.</div>}
      {Object.keys(globalVariables).map((key) => {
        let min, max, step;
        switch (key) {
          case 'mutationRate':
            min = 0.01; max = 0.1; step = 0.01;
            break;
          case 'eatingRange':
            min = 1; max = 50; step = 1;
            break;
          case 'foodHealthAmount':
            min = 10; max = 100; step = 1;
            break;
          case 'initialFoodCount':
            min = 10; max = 300; step = 1;
            break;
          case 'foodRespawnRate':
            min = 1; max = 50; step = 1;
            break;
          case 'foodRespawnInterval':
            min = 500; max = 5000; step = 100;
            break;
          case 'creatureCount':
            min = 10; max = 100; step = 1;
            break;
          case 'healthLossPerIntervalPrey':
            min = 0.01; max = 0.5; step = 0.01;
            break;
          case 'reproductionRate':
            min = 0.001; max = 0.005; step = 0.001;
            break;
          case 'predatorReproductionRate':
            min = 0.001; max = 0.005; step = 0.001;
            break;
          case 'baseHealthLossFromPredator':
            min = 10; max = 100; step = 1;
            break;
          case 'predatorHealthGain':
            min = 10; max = 100; step = 1;
            break;
          case 'initialPredatorCount':
            min = 1; max = 50; step = 1;
            break;
          case 'predatorEatingRange':
            min = 1; max = 50; step = 1;
            break;
          case 'healthLossPerIntervalPredator':
            min = 0.01; max = 0.4; step = 0.01;
            break;
          default:
            min = 0; max = 10; step = 1;
            break;
        }

        return (
          <div key={key} className="slider-control mb-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <label htmlFor={key} className="block mb-1">
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        );
      })}
      {tooltip && <div className="tooltip fixed bg-gray-700 text-white p-2 rounded z-50" style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}>{tooltip}</div>}
    </div>
  );
};

export default GlobalVariablesSliders;

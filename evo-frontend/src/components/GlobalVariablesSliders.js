import React from 'react';

const GlobalVariablesSliders = ({ globalVariables, setGlobalVariables, disabled }) => {
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setGlobalVariables(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="sliders-container">
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
            min = 1; max = 50; step = 1; // Food respawn rate: 1 to 50 items per interval
            break;
          case 'foodRespawnInterval':
            min = 500; max = 5000; step = 100; // Food respawn interval: 500 to 5000 milliseconds
            break;
          case 'creatureCount':
            min = 10; max = 100; step = 1; // Initial number of creatures: 10 to 100
            break;
          case 'healthLossPerInterval':
            min = 0.01; max = 1; step = 0.01; // Health loss per interval: 0.01 to 1 unit
            break;
          case 'reproductionRate':
            min = 0.001; max = 0.1; step = 0.001; // Reproduction rate: 0.1% to 10%
            break;
          default:
            min = 0; max = 10; step = 1; // Default range for unspecified variables
            break;
        }

        return (
          <div key={key} className="slider-control">
            <label htmlFor={key}>
              {`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${globalVariables[key]}`}
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default GlobalVariablesSliders;

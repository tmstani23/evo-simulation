import React, { useState, useEffect, useRef } from 'react';
import { generateGeneticCode } from './genetics/geneticCodeTemplate';
import { geneticVariables } from './genetics/geneticVariables';
import GridContainer from './components/GridContainer'; // Import the GridContainer component

const App = () => {
  const [geneticCodes, setGeneticCodes] = useState(Array.from({ length: 50 }, () => generateGeneticCode(geneticVariables)));
  const [foodItems, setFoodItems] = useState(Array.from({ length: 50 }, () => ({
    x: Math.random() * 790, // Random x-coordinate
    y: Math.random() * 590, // Random y-coordinate
  })));
  const [variables, setVariables] = useState(geneticVariables);
  const geneticCodesRef = useRef(geneticCodes);
  
  const handleVariableChange = (variableName, subVariableName, value) => {
    if (variableName === 'mutationRate') {
      setVariables(prevState => ({
        ...prevState,
        mutationRate: value
      }));
    } else {
      setVariables(prevState => ({
        ...prevState,
        [variableName]: {
          ...prevState[variableName],
          [subVariableName]: value
        }
      }));
    }
  };

  const regenerateGeneticCodes = () => {
    const newGeneticCodes = Array.from({ length: 50 }, () => generateGeneticCode(variables));
    setGeneticCodes(newGeneticCodes);
    geneticCodesRef.current = newGeneticCodes;
  };

  const calculateMovement = (creature) => {
    const speed = creature.velocity.speed;
    const direction = creature.velocity.direction;

    if (typeof speed !== 'number' || typeof direction !== 'number') {
      console.error('Invalid speed or direction:', speed, direction);
      return { deltaX: 0, deltaY: 0 };
    }

    const angle = direction * (Math.PI / 180); // Convert to radians
    const deltaX = speed * Math.cos(angle);
    const deltaY = speed * Math.sin(angle);

    console.log('Movement deltas:', deltaX, deltaY);
    return { deltaX, deltaY };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Updating genetic codes...');
      const updatedCodes = geneticCodesRef.current.map((creature) => {
        let { deltaX, deltaY } = calculateMovement(creature);

        let newX = creature.x + deltaX;
        let newY = creature.y + deltaY;

        if (newX <= 0 || newX >= 790) {
          creature.velocity.direction = 180 - creature.velocity.direction; // Invert direction
          deltaX = -deltaX; // Invert deltaX
          newX = creature.x + deltaX; // Recalculate newX
        }

        if (newY <= 0 || newY >= 590) {
          creature.velocity.direction = 360 - creature.velocity.direction; // Invert direction
          deltaY = -deltaY; // Invert deltaY
          newY = creature.y + deltaY; // Recalculate newY
        }

        console.log('Creature position:', creature.x, creature.y);
        console.log('New position:', newX, newY);
        console.log('Creature health:', creature.health);

        const newHealth = creature.health - 1;

        return {
          ...creature,
          x: Math.max(0, Math.min(newX, 790)),
          y: Math.max(0, Math.min(newY, 590)),
          health: newHealth,
        };
      }).filter(creature => creature.health > 0);

      setGeneticCodes(updatedCodes);
      geneticCodesRef.current = updatedCodes;
    }, 100); // Update every 100 milliseconds

    return () => {
      console.log('Clearing interval...');
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Genetic Variables</h2>
          {Object.keys(variables).map(key => (
            <div key={key}>
              <h3>{key}</h3>
              {Object.keys(variables[key]).map(subKey => (
                <div key={subKey}>
                  <label>{subKey}: </label>
                  <input
                    type="number"
                    value={variables[key][subKey]}
                    onChange={e => handleVariableChange(key, subKey, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          ))}

          <div>
            <label>Mutation Rate: </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={variables.mutationRate}
              onChange={e => handleVariableChange('mutationRate', 'default', parseFloat(e.target.value))}
            />
          </div>

          <button onClick={regenerateGeneticCodes}>Regenerate Genetic Codes</button>
          <span> - Generates new genetic codes based on the current variables.</span>
        </div>

        <div style={{ width: '800px', height: '600px', position: 'relative', overflow: 'hidden' }}>
          <h2>Simulation</h2>
          <GridContainer creatures={geneticCodes} foodItems={foodItems} />
        </div>
      </div>
    </div>
  );
};

export default App;

// App.js
import React, { useState, useEffect, useRef } from 'react';
import { startSimulation, stopSimulation, resetSimulation } from './simulation/SimulationLogic';
import { generateGeneticCode } from './genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from './genetics/geneticVariables';
import { generateUniqueId } from './utils/generateUniqueId';
import initialGlobalVariables from './components/globalVariables';
import Grid from './components/Grid';
import GlobalVariablesSliders from './components/GlobalVariablesSliders';
import './App.css';

const App = () => {
  const [globalVariables, setGlobalVariables] = useState(initialGlobalVariables);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [gridDimensions, setGridDimensions] = useState({ width: 800, height: 600 });

  const [geneticCodes, setGeneticCodes] = useState(
    Array.from({ length: globalVariables.creatureCount }, () => ({
      id: generateUniqueId(),
      geneticCode: generateGeneticCode(geneticVariables),
      health: { current: Math.floor(Math.random() * (geneticVariables.health.max - geneticVariables.health.min + 1)) + geneticVariables.health.min, max: geneticVariables.health.max }
    }))
  );
  const [predatorCodes, setPredatorCodes] = useState(
    Array.from({ length: globalVariables.initialPredatorCount }, () => ({
      id: generateUniqueId(),
      geneticCode: generateGeneticCode(predatorGeneticVariables),
      health: { current: Math.floor(Math.random() * (predatorGeneticVariables.health.max - geneticVariables.health.min + 1)) + predatorGeneticVariables.health.min, max: predatorGeneticVariables.health.max }
    }))
  );
  const [foodItems, setFoodItems] = useState(
    Array.from({ length: globalVariables.initialFoodCount }, () => ({
      id: generateUniqueId(), // Ensure unique ID for each food item
      x: Math.random() * 790,
      y: Math.random() * 590,
    }))
  );

  const geneticCodesRef = useRef(geneticCodes);
  const predatorCodesRef = useRef(predatorCodes);
  const foodItemsRef = useRef(foodItems);

  const intervalRef = useRef(null);
  const foodIntervalRef = useRef(null);

  const toggleDebugMode = () => setDebugMode(!debugMode);

  const handleStartSimulation = () => {
    startSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables, gridDimensions);
    setIsSimulationRunning(true);
  };

  const handleStopSimulation = () => {
    stopSimulation(intervalRef, foodIntervalRef);
    setIsSimulationRunning(false);
    setIsPaused(false);
  };

  const handleResetSimulation = () => {
    resetSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables, gridDimensions);
    setIsSimulationRunning(false);
    setIsPaused(false);
  };

  const handleCreatureClick = (creature) => {
    console.log('Clicked Creature:', creature);
    console.log('Position History:', creature.positionHistory);
  };

  const handleCreatureHover = (e, creature) => {
    if (!isSimulationRunning) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({ top: rect.top - 30, left: rect.left + rect.width / 2 });
      setTooltip(creature);
    }
  };

  const handleCreatureMouseLeave = () => {
    setTooltip(null);
  };

  useEffect(() => {
    const currentIntervalRef = intervalRef.current;
    const currentFoodIntervalRef = foodIntervalRef.current;

    return () => {
      clearInterval(currentIntervalRef);
      clearInterval(currentFoodIntervalRef);
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">Simulation Header</header>
      <div className="key-and-main-content">
        <div className="simulation-key">
          <h3>Simulation Key</h3>
          <div className="key-item"><div className="key-color creature-color"></div>Creatures</div>
          <div className="key-item"><div className="key-color predator-color"></div>Predators</div>
          <div className="key-item"><div className="key-color food-color"></div>Food</div>
          <div className="key-item"><div className="key-color creature-offspring-color"></div>Creature Offspring</div>
          <div className="key-item"><div className="key-color predator-offspring-color"></div>Predator Offspring</div>
          <h4>Debug Mode</h4>
          <div className="debug-item"><div className="vision-indicator"></div>Vision</div>
          <div className="debug-item"><div className="speed-indicator"></div>Speed</div>
        </div>
        <div className="main-content">
          <div className="grid-container">
            <Grid
              creatures={geneticCodes}
              predators={predatorCodes}
              foodItems={foodItems}
              debugMode={debugMode}
              onClickCreature={handleCreatureClick}
              onHoverCreature={handleCreatureHover}
              onMouseLeaveCreature={handleCreatureMouseLeave}
              setGridDimensions={setGridDimensions}
            />
          </div>
          <div className="controls-container">
            <button onClick={handleStartSimulation} disabled={isSimulationRunning}>Start Simulation</button>
            <button onClick={handleStopSimulation} disabled={!isSimulationRunning}>Stop Simulation</button>
            <button onClick={handleResetSimulation} disabled={isSimulationRunning}>Reset Simulation</button>
            <button onClick={toggleDebugMode}>Toggle Debug Mode</button>
          </div>
          <div className="sliders-container">
            <GlobalVariablesSliders globalVariables={globalVariables} setGlobalVariables={setGlobalVariables} disabled={isSimulationRunning} />
          </div>
        </div>
      </div>
      <footer className="app-footer">Simulation Footer</footer>
      {tooltip && (
        <div className="creature-tooltip" style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}>
          <div>ID: {tooltip.id}</div>
          <div>Health: {tooltip.health.current}/{tooltip.health.max}</div>
          <div>Speed: {tooltip.geneticCode.velocity.speed.toFixed(2)}</div>
          <div>Direction: {tooltip.geneticCode.velocity.direction.toFixed(2)}</div>
          <div>Vision: {tooltip.geneticCode.vision.toFixed(2)}</div>
          <div>Strength: {tooltip.geneticCode.strength.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default App;

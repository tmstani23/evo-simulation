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
  const [debugMode, setDebugMode] = useState(false);

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
      health: { current: Math.floor(Math.random() * (predatorGeneticVariables.health.max - predatorGeneticVariables.health.min + 1)) + predatorGeneticVariables.health.min, max: predatorGeneticVariables.health.max }
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
    startSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables);
    setIsSimulationRunning(true);
  };

  const handleStopSimulation = () => {
    stopSimulation(intervalRef, foodIntervalRef);
    setIsSimulationRunning(false);
  };

  const handleResetSimulation = () => {
    resetSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables);
    setIsSimulationRunning(false);
  };

  const handleCreatureClick = (creature) => {
    if (!isSimulationRunning) {
      console.log('Clicked Creature:', creature);
      console.log('Position History:', creature.positionHistory);
    }
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
      <div className="main-content">
        <div className="grid-container">
          <Grid creatures={geneticCodes} predators={predatorCodes} foodItems={foodItems} debugMode={debugMode} onClickCreature={handleCreatureClick} />
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
      <footer className="app-footer">Simulation Footer</footer>
    </div>
  );
};

export default App;

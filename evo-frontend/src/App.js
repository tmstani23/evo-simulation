import React, { useState, useEffect, useRef } from 'react';
import { startSimulation, stopSimulation, resetSimulation } from './simulation/SimulationLogic';
import { generateGeneticCode } from './genetics/geneticCodeTemplate';
import { geneticVariables, predatorGeneticVariables } from './genetics/geneticVariables';
import { generateUniqueId } from './genetics/utils'; // Correct import path
import initialGlobalVariables from './components/globalVariables'; // Updated import path
import Grid from './components/Grid';
import GlobalVariablesSliders from './components/GlobalVariablesSliders'; // Ensure single import
import './App.css'; // Import global CSS file

const App = () => {
  // State for global variables
  const [globalVariables, setGlobalVariables] = useState(initialGlobalVariables);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false); // Track if the simulation is running

  // State for storing genetic codes of creatures, predators, food items, and debug mode
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
      x: Math.random() * 790,
      y: Math.random() * 590,
    }))
  );
  const [debugMode, setDebugMode] = useState(false); // State for debug mode

  // Refs to keep track of the current state of genetic codes and food items
  const geneticCodesRef = useRef(geneticCodes);
  const predatorCodesRef = useRef(predatorCodes);
  const foodItemsRef = useRef(foodItems);

  // Refs for managing simulation intervals
  const intervalRef = useRef(null);
  const foodIntervalRef = useRef(null);

  // Function to toggle debug mode
  const toggleDebugMode = () => setDebugMode(!debugMode);

  // Function to start the simulation
  const handleStartSimulation = () => {
    startSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables);
    setIsSimulationRunning(true);
  };

  // Function to stop the simulation
  const handleStopSimulation = () => {
    stopSimulation(intervalRef, foodIntervalRef);
    setIsSimulationRunning(false);
  };

  // Function to reset the simulation
  const handleResetSimulation = () => {
    resetSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables);
    setIsSimulationRunning(false);
  };

  // Effect to clean up intervals on component unmount
  useEffect(() => {
    const currentIntervalRef = intervalRef.current;
    const currentFoodIntervalRef = foodIntervalRef.current;

    return () => {
      clearInterval(currentIntervalRef);
      clearInterval(currentFoodIntervalRef);
    };
  }, []);

  // Render the main UI components
  return (
    <div className="app-container">
      <header className="app-header">Simulation Header</header>
      <div className="main-content">
        <div className="grid-container">
          <Grid creatures={geneticCodes} predators={predatorCodes} foodItems={foodItems} debugMode={debugMode} />
        </div>
        <div className="controls-container">
          <button onClick={handleStartSimulation}>Start Simulation</button>
          <button onClick={handleStopSimulation}>Stop Simulation</button>
          <button onClick={handleResetSimulation}>Reset Simulation</button>
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

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import geneticSymbol from './images/geneticSymbol.png'; 
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

  const navigate = useNavigate();

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
    if (isPaused) {
      setIsPaused(false); // Reset paused state
      setIsSimulationRunning(true); // Resume simulation without resetting
    } else {
      startSimulation(setGeneticCodes, setPredatorCodes, setFoodItems, geneticCodesRef, predatorCodesRef, foodItemsRef, intervalRef, foodIntervalRef, globalVariables, gridDimensions);
      setIsSimulationRunning(true);
    }
  };

  const handleStopSimulation = () => {
    stopSimulation(intervalRef, foodIntervalRef);
    setIsSimulationRunning(false);
    setIsPaused(true); // Set paused state
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
    <div className="app-container pt-20 pb-16">
      <header className="w-full bg-teal-500 text-white py-4 flex justify-between items-center fixed top-0 z-50 px-4">
        <div className="flex items-center space-x-4">
          <img src={geneticSymbol} alt="EvoLife Logo" className="h-20 w-20 rounded-full" /> 
        </div>
        <h1 className="text-6xl font-bold flex-grow text-center font-poppins">EvoLife</h1>
      </header>
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
          <div className="debug-item"><div className="arrow-width"></div>Arrow Width = Strength</div>
          <button onClick={() => { handleStopSimulation(); navigate('/tutorial'); }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Tutorial</button>
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
      <footer className="w-full bg-teal-500 text-white py-4 flex flex-col md:flex-row justify-center items-center fixed bottom-0 z-50 px-4">
        <div className="text-center">
          <p className="text-sm">&copy; 2024 EvoLife. All rights reserved.</p>
          <p>Contact us: <a href="mailto:thriveloomhq@gmail.com" className="underline">thriveloomhq@gmail.com</a></p>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0 ml-4 md:ml-8">
          <a href="https://x.com/ThriveLoom" target="_blank" rel="noopener noreferrer">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.005.959-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.205-4.928 4.929 0 .39.043.765.127 1.124-4.094-.205-7.725-2.165-10.148-5.144-.424.725-.666 1.561-.666 2.452 0 1.69.86 3.179 2.168 4.053-.798-.026-1.55-.245-2.204-.614v.061c0 2.364 1.68 4.337 3.914 4.782-.409.111-.839.171-1.284.171-.313 0-.616-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.684 1.318-3.809 2.106-6.102 2.106-.396 0-.786-.023-1.172-.068 2.179 1.398 4.768 2.212 7.557 2.212 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.634.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
        </div>
      </footer>


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

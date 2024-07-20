import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [creatures, setCreatures] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startSimulation = () => {
    axios.get('/start')
      .then(response => {
        console.log(response.data);
        setIsRunning(true); // Set the simulation to running
      })
      .catch(error => {
        console.error('Error starting the simulation:', error.response || error.message);
      });
  };

  const stopSimulation = () => {
    setIsRunning(false); // Stop the simulation
    clearInterval(intervalRef.current); // Clear the interval immediately
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        axios.post('/update')
          .then(response => {
            setCreatures(response.data.creatures);
          })
          .catch(error => {
            console.error('Error updating the simulation:', error.response || error.message);
          });
      }, 1000);
    }

    // Cleanup interval on component unmount or when simulation stops
    return () => clearInterval(intervalRef.current);
  }, [isRunning]); // Depend on isRunning to start/stop the interval

  return (
    <div className="App">
      <button onClick={startSimulation} disabled={isRunning}>Start Simulation</button>
      <button onClick={stopSimulation} disabled={!isRunning}>Stop Simulation</button>
      <div>
        {creatures.map(creature => (
          <div key={creature.id}>
            {/* Render creature */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

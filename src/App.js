import React, { useState } from 'react';
import Grid from './Grid';
import './App.css';

function App() {
  // State to control the simulation status
  const [isRunning, setIsRunning] = useState(false);

  // Handler for the 'Start' button
  const startGame = () => {
    setIsRunning(true);
    // Additional logic to start the simulation will go here
  };

  // Handler for the 'Stop' button
  const stopGame = () => {
    setIsRunning(false);
    // Additional logic to stop the simulation will go here
  };

  const [resetFlag, setResetFlag] = useState(false);

  // Handler for the 'Reset' button
  const resetGame = () => {
    setIsRunning(false);
    setResetFlag(prev => !prev); // Toggle the reset flag to trigger a grid reset
  };

  return (
    <div>
      <h1>Game of Life</h1>
      <Grid isRunning={isRunning} resetFlag={resetFlag} />
      <div>
        <button onClick={startGame} disabled={isRunning}>Start</button>
        <button onClick={stopGame} disabled={!isRunning}>Stop</button>
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { EnvironmentParams } from '../hooks/useSimulationControl';

interface SimulationControlsProps {
  isRunning: boolean;
  speed: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onEnvironmentChange: (params: EnvironmentParams) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  speed,
  onStart,
  onStop,
  onReset,
  onSpeedChange,
  onEnvironmentChange,
  onSave,
  onLoad,
  onClear,
}) => {
  const [foodSpawnRate, setFoodSpawnRate] = useState(0.1);
  const [maxAgents, setMaxAgents] = useState(50);
  const [obstacleCount, setObstacleCount] = useState(5);

  const handleFoodSpawnRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFoodSpawnRate(value);
    onEnvironmentChange({ foodSpawnRate: value, maxAgents, obstacleCount });
  };

  const handleMaxAgentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMaxAgents(value);
    onEnvironmentChange({ foodSpawnRate, maxAgents: value, obstacleCount });
  };

  const handleObstacleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setObstacleCount(value);
    onEnvironmentChange({ foodSpawnRate, maxAgents, obstacleCount: value });
  };

  return (
    <div className="simulation-controls">
      <button onClick={isRunning ? onStop : onStart}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={onReset}>Reset</button>
      <div>
        <label htmlFor="speed">Simulation Speed: {speed.toFixed(1)}</label>
        <input
          type="range"
          id="speed"
          min="0.1"
          max="10"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="foodSpawnRate">Food Spawn Rate:</label>
        <input
          type="range"
          id="foodSpawnRate"
          min="0"
          max="1"
          step="0.01"
          value={foodSpawnRate}
          onChange={handleFoodSpawnRateChange}
        />
        <span>{foodSpawnRate.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="maxAgents">Max Agents:</label>
        <input
          type="number"
          id="maxAgents"
          min="1"
          max="200"
          value={maxAgents}
          onChange={handleMaxAgentsChange}
        />
      </div>
      <div>
        <label htmlFor="obstacleCount">Obstacle Count:</label>
        <input
          type="number"
          id="obstacleCount"
          min="0"
          max="50"
          value={obstacleCount}
          onChange={handleObstacleCountChange}
        />
      </div>
      <div>
        <button onClick={onSave}>Save Simulation</button>
        <button onClick={onLoad}>Load Simulation</button>
        <button onClick={onClear}>Clear Saved Simulation</button>
      </div>
    </div>
  );
};

export default SimulationControls;

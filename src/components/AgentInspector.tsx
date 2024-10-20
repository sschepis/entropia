import React from 'react';
import { Agent } from '../types/Agent';
import SparklineChart from './SparklineChart';

interface AgentInspectorProps {
  agent: Agent | null;
}

const AgentInspector: React.FC<AgentInspectorProps> = ({ agent }) => {
  if (!agent) {
    return <div className="agent-inspector">No agent selected</div>;
  }

  return (
    <div className="agent-inspector">
      <h2>Agent Inspector</h2>
      <p>ID: {agent.id}</p>
      <p>Position: ({agent.state.x.toFixed(2)}, {agent.state.y.toFixed(2)})</p>
      <p>Energy: {agent.state.energy.toFixed(2)} / {agent.state.maxEnergy}</p>
      <SparklineChart data={agent.history.energy} color="#ff9900" label="Energy" />
      <p>Energy Efficiency: {agent.state.energyEfficiency.toFixed(2)}</p>
      <SparklineChart data={agent.history.energyEfficiency} color="#00ff00" label="Energy Efficiency" />
      <p>Movement Speed: {agent.state.movementSpeed.toFixed(2)}</p>
      <SparklineChart data={agent.history.movementSpeed} color="#0099ff" label="Movement Speed" />
      <p>Sensor Range: {agent.state.sensorRange.toFixed(2)}</p>
      <SparklineChart data={agent.history.sensorRange} color="#ff00ff" label="Sensor Range" />
    </div>
  );
};

export default AgentInspector;

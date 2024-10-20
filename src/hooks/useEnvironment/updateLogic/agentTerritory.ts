import { Agent } from '../types';

const TERRITORY_MARK_RATE = 0.001;
const TERRITORY_DECAY_RATE = 0.0005;

export const markTerritory = (agent: Agent) => {
  agent.state.territoryStrength = Math.min(1, agent.state.territoryStrength + TERRITORY_MARK_RATE * agent.genome.territorialAwareness);
};

export const updateTerritory = (agent: Agent) => {
  agent.state.territoryStrength = Math.max(0, agent.state.territoryStrength - TERRITORY_DECAY_RATE);
  
  // Update territory center based on agent's current position
  agent.state.territoryCenterX = agent.state.x * 0.01 + agent.state.territoryCenterX * 0.99;
  agent.state.territoryCenterY = agent.state.y * 0.01 + agent.state.territoryCenterY * 0.99;
};

export const updateAgentHistory = (agent: Agent) => {
  agent.history.energy.push(agent.state.energy);
  agent.history.energyEfficiency.push(agent.state.energyEfficiency);
  agent.history.speed.push(agent.state.speed);
  agent.history.size.push(agent.state.size);
  agent.history.camouflage.push(agent.state.camouflage);
  agent.history.sensoryRange.push(agent.state.sensoryRange);
  agent.history.movementSpeed.push(agent.state.movementSpeed);
  agent.history.sensorRange.push(agent.state.sensorRange);

  const historyLength = 100;
  Object.keys(agent.history).forEach(key => {
    agent.history[key as keyof typeof agent.history] = agent.history[key as keyof typeof agent.history].slice(-historyLength);
  });
};

export const isInTerritory = (agent: Agent, x: number, y: number): boolean => {
  const distanceToCenter = Math.sqrt(
    Math.pow(x - agent.state.territoryCenterX, 2) +
    Math.pow(y - agent.state.territoryCenterY, 2)
  );
  return distanceToCenter <= agent.state.territoryRadius;
};

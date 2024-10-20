import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';

export const calculateEnergyChange = (agent: Agent, environment: Environment): number => {
  const previousEnergy = agent.state.previousEnergy;
  const currentEnergy = agent.state.energy;
  
  // Calculate energy change
  const deltaE = currentEnergy - previousEnergy;
  
  // Calculate work done by the agent (simplified as movement)
  const dx = agent.state.x - agent.state.previousX;
  const dy = agent.state.y - agent.state.previousY;
  const distanceMoved = Math.sqrt(dx * dx + dy * dy);
  const workDone = distanceMoved * agent.state.movementSpeed;
  
  // Calculate heat flow (simplified as energy gained from food)
  const heatFlow = Math.max(0, deltaE + workDone);
  
  // Energy flow equation: dE_sys/dt = dQ - dW + dU
  // Here we're calculating the discrete change, so we don't divide by dt
  return heatFlow - workDone + deltaE;
};

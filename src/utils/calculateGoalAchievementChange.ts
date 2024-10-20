import { Agent } from '../types/Agent';

export const calculateGoalAchievementChange = (agent: Agent): number => {
  // Calculate the change in energy as a measure of goal achievement
  const energyChange = agent.state.energy - agent.state.previousEnergy;
  
  // Normalize the energy change relative to the agent's maximum energy
  const normalizedChange = energyChange / agent.state.maxEnergy;
  
  // Consider the agent's current energy level in the calculation
  const currentEnergyRatio = agent.state.energy / agent.state.maxEnergy;
  
  // Calculate the goal achievement change as a weighted sum of energy change and current energy level
  const weightEnergyChange = 0.7;
  const weightCurrentEnergy = 0.3;
  
  return weightEnergyChange * normalizedChange + weightCurrentEnergy * currentEnergyRatio;
};

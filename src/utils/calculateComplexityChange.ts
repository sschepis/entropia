import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { calculateInformationChange } from './calculateInformationChange';

export const calculateComplexityChange = (agent: Agent, environment: Environment): number => {
  // Simplified complexity change calculation
  const K = 0.1; // Complexity gain function (simplified)
  const Closs = 0.05; // Complexity loss (simplified)
  const Ceff = agent.state.energy / agent.state.maxEnergy; // Effective complexity (simplified)
  const Phi = calculateInformationChange(agent, environment); // Using information change as a proxy for integrated information
  return K * Phi - Closs + Ceff;
};

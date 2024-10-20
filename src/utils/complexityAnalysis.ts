import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';

export const analyzeComplexity = (agent: Agent, environment: Environment): number => {
  const complexityGain = calculateComplexityGain(agent, environment);
  const complexityLoss = calculateComplexityLoss(agent);
  const effectiveComplexity = calculateEffectiveComplexity(agent);
  const integratedInformation = calculateIntegratedInformation(agent);

  // Complexity change equation: dC_sys/dt = K(I_sys, Ω) - C_loss + C_eff + Φ(X)
  return complexityGain - complexityLoss + effectiveComplexity + integratedInformation;
};

const calculateComplexityGain = (agent: Agent, environment: Environment): number => {
  // Simplified calculation of complexity gain based on information and synchronization
  const informationProcessing = Object.keys(agent.state).length;
  const synchronization = calculateSynchronization(agent, environment);
  return informationProcessing * synchronization;
};

const calculateComplexityLoss = (agent: Agent): number => {
  // Simplified calculation of complexity loss
  return 0.1 * agent.state.energy; // Assume some complexity loss proportional to energy
};

const calculateEffectiveComplexity = (agent: Agent): number => {
  // Simplified calculation of effective complexity
  const stateValues = Object.values(agent.state).filter(v => typeof v === 'number') as number[];
  const mean = stateValues.reduce((sum, v) => sum + v, 0) / stateValues.length;
  const variance = stateValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / stateValues.length;
  return Math.sqrt(variance);
};

const calculateIntegratedInformation = (agent: Agent): number => {
  // Simplified calculation of integrated information using von Neumann entropy
  const stateValues = Object.values(agent.state).filter(v => typeof v === 'number') as number[];
  const normalizedValues = stateValues.map(v => v / Math.max(...stateValues));
  return -normalizedValues.reduce((sum, v) => sum + v * Math.log(v), 0);
};

const calculateSynchronization = (agent: Agent, environment: Environment): number => {
  const agentStateProb = agent.state.energy / environment.state.maxEnergy;
  const envStateProb = environment.state.totalEnergy / (environment.state.maxEnergy * environment.state.agents.length);
  const jointProb = agentStateProb * envStateProb;
  return jointProb * Math.log(jointProb / (agentStateProb * envStateProb));
};

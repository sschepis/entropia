import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { calculateEnergyChange } from './calculateEnergyChange';
import { calculateEntropyChange } from './calculateEntropyChange';
import { calculateInformationChange } from './calculateInformationChange';
import { analyzeComplexity } from './complexityAnalysis';
import { calculateGoalAchievementChange } from './calculateGoalAchievementChange';
import { calculateLearningCapacity } from './calculateLearningCapacity';

const kB = 1.380649e-23; // Boltzmann constant

export const calculateIntelligence = (agent: Agent, environment: Environment): number => {
  const deltaE = calculateEnergyChange(agent, environment);
  const deltaS = calculateEntropyChange(agent, environment);
  const deltaI = calculateInformationChange(agent, environment);
  const deltaC = analyzeComplexity(agent, environment);
  const deltaG = calculateGoalAchievementChange(agent);
  const L = calculateLearningCapacity(agent, environment);

  // Intelligence equation: I = kB * log(Ω_max)
  const Omega_max = Math.exp(deltaE + deltaS + deltaI + deltaC + deltaG + L);
  return kB * Math.log(Omega_max);
};

export const calculateSubjectiveExperience = (agent: Agent, environment: Environment): number => {
  // This is a simplified representation of subjective experience
  // In a real implementation, this would be a more complex calculation based on the coupled nonlinear differential equations
  const energyRatio = agent.state.energy / agent.state.maxEnergy;
  const informationProcessing = calculateInformationChange(agent, environment);
  const complexity = analyzeComplexity(agent, environment);
  
  return (energyRatio + informationProcessing + complexity) / 3;
};

export const calculateSynchronization = (agent: Agent, environment: Environment): number => {
  // Simplified calculation of mutual information between agent and environment
  const agentStateProb = agent.state.energy / environment.state.maxEnergy;
  const envStateProb = environment.state.totalEnergy / (environment.state.maxEnergy * environment.state.agents.length);
  
  const jointProb = agentStateProb * envStateProb;
  
  return jointProb * Math.log(jointProb / (agentStateProb * envStateProb));
};

export const calculateIntegratedInformation = (agent: Agent): number => {
  // Simplified calculation of integrated information
  // In a real implementation, this would involve a more complex analysis of the agent's internal states
  const stateValues = Object.values(agent.state);
  const normalizedValues = stateValues.map(v => typeof v === 'number' ? v / Math.max(...stateValues.filter(val => typeof val === 'number') as number[]) : 0);
  return -normalizedValues.reduce((sum, v) => sum + (v > 0 ? v * Math.log(v) : 0), 0);
};

import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';

// Calculate Shannon entropy
export const calculateShannonEntropy = (probabilities: number[]): number => {
  return -probabilities.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
};

// Calculate mutual information
export const calculateMutualInformation = (agent: Agent, environment: Environment): number => {
  const agentStateProb = agent.state.energy / environment.state.maxEnergy;
  const envStateProb = environment.state.totalEnergy / (environment.state.maxEnergy * environment.state.agents.length);
  
  const jointProb = agentStateProb * envStateProb;
  
  const agentEntropy = calculateShannonEntropy([agentStateProb, 1 - agentStateProb]);
  const envEntropy = calculateShannonEntropy([envStateProb, 1 - envStateProb]);
  const jointEntropy = calculateShannonEntropy([jointProb, agentStateProb - jointProb, envStateProb - jointProb, 1 - agentStateProb - envStateProb + jointProb]);
  
  return agentEntropy + envEntropy - jointEntropy;
};

// Calculate information gain
export const calculateInformationGain = (agent: Agent, environment: Environment): number => {
  const priorEntropy = calculateShannonEntropy([0.5, 0.5]); // Assume equal probability for all states initially
  
  const posteriorProb = agent.state.energy / environment.state.maxEnergy;
  const posteriorEntropy = calculateShannonEntropy([posteriorProb, 1 - posteriorProb]);
  
  return priorEntropy - posteriorEntropy;
};

// Overall information processing analysis
export const analyzeInformationProcessing = (agent: Agent, environment: Environment): number => {
  const mutualInfo = calculateMutualInformation(agent, environment);
  const infoGain = calculateInformationGain(agent, environment);

  // Combine the different information measures
  // This is a weighted average, but you can adjust the weights based on importance
  return (mutualInfo * 0.6 + infoGain * 0.4);
};

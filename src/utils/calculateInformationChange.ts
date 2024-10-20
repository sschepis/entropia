import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';

export const calculateInformationChange = (agent: Agent, environment: Environment): number => {
  // Calculate mutual information between agent and environment
  const mutualInformation = calculateMutualInformation(agent, environment);

  // Calculate information loss (simplified)
  const informationLoss = 0.1 * agent.state.energy; // Assume some information loss proportional to energy

  // Calculate transfer entropy (simplified)
  const transferEntropy = calculateTransferEntropy(agent, environment);

  // Information flow equation: dI_sys/dt = H(I_sys, I_env) - Ψ_loss + T(I_env → I_sys)
  return mutualInformation - informationLoss + transferEntropy;
};

const calculateMutualInformation = (agent: Agent, environment: Environment): number => {
  const agentStateProb = agent.state.energy / environment.state.maxEnergy;
  const envStateProb = environment.state.totalEnergy / (environment.state.maxEnergy * environment.state.agents.length);
  
  const jointProb = agentStateProb * envStateProb;
  
  return jointProb * Math.log(jointProb / (agentStateProb * envStateProb));
};

const calculateTransferEntropy = (agent: Agent, environment: Environment): number => {
  // Simplified calculation of transfer entropy
  // In a real implementation, this would involve a more complex analysis of the temporal dynamics
  const agentComplexity = Object.values(agent.state).filter(v => typeof v === 'number').length;
  const envComplexity = environment.state.agents.length + environment.state.food.length;
  
  return Math.log(envComplexity / agentComplexity);
};

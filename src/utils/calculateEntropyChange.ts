import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';

const kB = 1.380649e-23; // Boltzmann constant

export const calculateEntropyChange = (agent: Agent, environment: Environment): number => {
  // Calculate the probability distribution of the agent's state
  const totalEnergy = environment.state.agents.reduce((sum, a) => sum + a.state.energy, 0);
  const agentProb = agent.state.energy / totalEnergy;

  // Calculate the maximum entropy distribution (uniform distribution)
  const uniformProb = 1 / environment.state.agents.length;

  // Calculate the entropy change using the formula from FORMULAE.md
  // ΔS_sys = kB * Σ P(x) * log(Q(x) / P(x))
  const entropyChange = kB * agentProb * Math.log(uniformProb / agentProb);

  return entropyChange;
};

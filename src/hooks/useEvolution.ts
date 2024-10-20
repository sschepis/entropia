import { useCallback } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { evolvePopulation, applyEvolution } from '../utils/evolution';

const useEvolution = (agents: Agent[], environment: Environment) => {
  const evolve = useCallback(() => {
    const fitnessFunction = (agent: Agent) => {
      // This is a simple fitness function based on the agent's energy
      // You may want to implement a more sophisticated fitness function
      return agent.state.energy;
    };

    const evolvedAgents = evolvePopulation(agents, fitnessFunction);
    return applyEvolution(evolvedAgents);
  }, [agents, environment]);

  return { evolve };
};

export default useEvolution;

import { Agent, AgentState } from '../types/Agent';
import { NeuralNetwork } from '../hooks/useEnvironment/types';

interface Gene {
  energyEfficiency: number;
  movementSpeed: number;
  sensorRange: number;
  brain: NeuralNetwork;
}

const mutate = (gene: Gene, mutationRate: number): Gene => {
  const mutatedBrain = gene.brain.copy();
  mutatedBrain.mutate(mutationRate);

  return {
    energyEfficiency: gene.energyEfficiency + (Math.random() - 0.5) * mutationRate,
    movementSpeed: gene.movementSpeed + (Math.random() - 0.5) * mutationRate,
    sensorRange: gene.sensorRange + (Math.random() - 0.5) * mutationRate,
    brain: mutatedBrain,
  };
};

const crossover = (parent1: Gene, parent2: Gene): Gene => {
  // For simplicity, we'll just choose one parent's brain randomly
  const brain = Math.random() < 0.5 ? parent1.brain.copy() : parent2.brain.copy();

  return {
    energyEfficiency: (parent1.energyEfficiency + parent2.energyEfficiency) / 2,
    movementSpeed: (parent1.movementSpeed + parent2.movementSpeed) / 2,
    sensorRange: (parent1.sensorRange + parent2.sensorRange) / 2,
    brain: brain,
  };
};

export const evolvePopulation = (agents: Agent[], fitnessFunction: (agent: Agent) => number): Agent[] => {
  // Sort agents by fitness
  const sortedAgents = [...agents].sort((a, b) => fitnessFunction(b) - fitnessFunction(a));

  // Select top 50% as parents
  const parents = sortedAgents.slice(0, Math.floor(sortedAgents.length / 2));

  // Create new population
  const newPopulation: Agent[] = [];

  while (newPopulation.length < agents.length) {
    // Select two random parents
    const parent1 = parents[Math.floor(Math.random() * parents.length)];
    const parent2 = parents[Math.floor(Math.random() * parents.length)];

    // Perform crossover
    const childGenes = crossover(
      { ...parent1.state, brain: parent1.brain },
      { ...parent2.state, brain: parent2.brain }
    );

    // Mutate
    const mutatedGenes = mutate(childGenes, 0.1);

    // Create new agent with mutated genes
    const newAgent: Agent = {
      ...parent1,
      id: `offspring-${newPopulation.length}`,
      state: {
        ...parent1.state,
        energyEfficiency: mutatedGenes.energyEfficiency,
        movementSpeed: mutatedGenes.movementSpeed,
        sensorRange: mutatedGenes.sensorRange,
      },
      brain: mutatedGenes.brain,
    };

    newPopulation.push(newAgent);
  }

  return newPopulation;
};

export const applyEvolution = (agents: Agent[]): Agent[] => {
  const fitnessFunction = (agent: Agent): number => {
    return agent.state.energy * agent.state.energyEfficiency;
  };

  return evolvePopulation(agents, fitnessFunction);
};

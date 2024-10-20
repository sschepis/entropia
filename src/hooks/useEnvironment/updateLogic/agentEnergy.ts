import { Agent, Food } from '../types';

const ENERGY_DECAY_RATE = 0.001;
const ENERGY_GAIN_FROM_FOOD = 0.3;

export const consumeFood = (agent: Agent, food: Food) => {
  const energyGained = food.energy * ENERGY_GAIN_FROM_FOOD * agent.genome.resourceEfficiency;
  agent.state.energy = Math.min(agent.state.maxEnergy, agent.state.energy + energyGained);
  food.energy = 0; // The food is consumed
};

export const updateAgentEnergy = (agent: Agent) => {
  const sizeEnergyFactor = Math.pow(agent.state.size / 20, 2); // Assuming MAX_SIZE is 20
  const energyLoss = ENERGY_DECAY_RATE * (2 - agent.genome.energyEfficiency) * (1 + sizeEnergyFactor);
  
  agent.state.energy = Math.max(0, agent.state.energy - energyLoss);

  // Robustness can occasionally provide a small energy boost
  if (Math.random() < agent.genome.robustness) {
    agent.state.energy = Math.min(agent.state.maxEnergy, agent.state.energy + ENERGY_DECAY_RATE * 0.5);
  }
};

export const canEatPrey = (predator: Agent, prey: Agent): boolean => {
  const distance = Math.sqrt(Math.pow(predator.state.x - prey.state.x, 2) + Math.pow(predator.state.y - prey.state.y, 2));
  return distance < predator.state.size + prey.state.size;
};

export const consumePrey = (predator: Agent, prey: Agent) => {
  const energyGained = prey.state.energy * predator.genome.resourceEfficiency;
  predator.state.energy = Math.min(predator.state.maxEnergy, predator.state.energy + energyGained);
  prey.state.energy = 0; // The prey dies
};

export const findFoodInRange = (agent: Agent, food: Food[]): Food | undefined => {
  return food.find(f => agent.distanceTo(f) <= agent.state.sensorRange);
}

export const findPreyInRange = (agent: Agent, prey: Agent[]): Agent | undefined => {
  return prey.find(p => canEatPrey(agent, p));
}

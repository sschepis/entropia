import { Agent, EnvironmentState, Food } from '../types';
import { makeDecision, findNearestPredator, findNearestPrey, findNearestFood, findNearestAgent } from './agentDecision';
import { moveAgentTowardsTarget, fleeFromPredator, exploreRandomly } from './agentMovement';
import { consumeFood, updateAgentEnergy } from './agentEnergy';
import { markTerritory, updateTerritory } from './agentTerritory';

export const updateAgent = (agent: Agent, state: EnvironmentState, environmentalFactor: number): Agent => {
  const updatedAgent = { ...agent };

  // Store previous state
  updatedAgent.state.previousX = updatedAgent.state.x;
  updatedAgent.state.previousY = updatedAgent.state.y;
  updatedAgent.state.previousEnergy = updatedAgent.state.energy;

  // Make decision
  const decision = makeDecision(updatedAgent, state);

  // Execute decision
  switch (decision) {
    case 'flee':
      const nearestPredator = findNearestPredator(updatedAgent, state.agents);
      if (nearestPredator) {
        fleeFromPredator(updatedAgent, nearestPredator, state);
      }
      break;
    case 'hunt':
      const nearestPrey = findNearestPrey(updatedAgent, state.agents);
      if (nearestPrey) {
        moveAgentTowardsTarget(updatedAgent, nearestPrey.state, state);
      }
      break;
    case 'eat':
      const nearestFood = findNearestFood(updatedAgent, state.food);
      if (nearestFood) {
        moveAgentTowardsTarget(updatedAgent, nearestFood, state);
        consumeFood(updatedAgent, nearestFood);
      }
      break;
    case 'explore':
      exploreRandomly(updatedAgent, state);
      break;
    case 'socialize':
      const nearestAgent = findNearestAgent(updatedAgent, state.agents);
      if (nearestAgent) {
        moveAgentTowardsTarget(updatedAgent, nearestAgent.state, state);
      }
      break;
  }

  // Update energy
  updateAgentEnergy(updatedAgent);

  // Update territory
  if (updatedAgent.genome.territorialAwareness > 0.5) {
    markTerritory(updatedAgent);
  }
  updateTerritory(updatedAgent);

  // Update experience and age
  updatedAgent.experience += 0.01;
  updatedAgent.age += 1;

  // Learn from the action
  const reward = updatedAgent.state.energy - updatedAgent.state.previousEnergy;
  updatedAgent.brain.backward([reward], updatedAgent.genome.learningRate);

  // Mutate the brain occasionally
  if (Math.random() < updatedAgent.genome.mutationRate) {
    updatedAgent.brain.mutate(0.1);
  }

  return updatedAgent;
};

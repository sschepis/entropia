import { Agent, EnvironmentState, EnvironmentAction } from './types';
import { applyLearning } from '../../utils/learning';
import { makeDecision, findNearestFood, findNearestPrey, findNearestPredator } from './updateLogic/agentDecision';
import { moveAgentTowardsTarget, fleeFromPredator, exploreRandomly } from './updateLogic/agentMovement';
import { findFoodInRange, consumeFood, canEatPrey, consumePrey, updateAgentEnergy } from './updateLogic/agentEnergy';
import { markTerritory, updateTerritory, updateAgentHistory } from './updateLogic/agentTerritory';
import { updateEnvironment } from './updateLogic/environmentUpdate';

export const updateAgent = (agent: Agent, state: EnvironmentState): Agent => {
  const learningAgent = applyLearning(agent as any, { state } as any) as Agent;

  learningAgent.state.previousX = learningAgent.state.x;
  learningAgent.state.previousY = learningAgent.state.y;

  const nearestFood = findNearestFood(learningAgent, state.food);
  const nearestPrey = learningAgent.state.isPredator ? findNearestPrey(learningAgent, state.agents) : null;
  const nearestPredator = !learningAgent.state.isPredator ? findNearestPredator(learningAgent, state.agents) : null;

  const decision = makeDecision(learningAgent, state);

  switch (decision) {
    case 'move_to_food':
      if (nearestFood) moveAgentTowardsTarget(learningAgent, nearestFood, state);
      break;
    case 'hunt_prey':
      if (nearestPrey) moveAgentTowardsTarget(learningAgent, nearestPrey.state, state);
      break;
    case 'flee_predator':
      if (nearestPredator) fleeFromPredator(learningAgent, nearestPredator, state);
      break;
    case 'explore':
      exploreRandomly(learningAgent, state);
      break;
    case 'mark_territory':
      markTerritory(learningAgent);
      break;
  }

  learningAgent.state.previousEnergy = learningAgent.state.energy;

  if (decision === 'move_to_food') {
    const food = findFoodInRange(learningAgent, state.food);
    if (food) {
      consumeFood(learningAgent, food);
    }
  } else if (decision === 'hunt_prey' && nearestPrey) {
    if (canEatPrey(learningAgent, nearestPrey)) {
      consumePrey(learningAgent, nearestPrey);
    }
  }

  updateAgentEnergy(learningAgent);
  updateAgentHistory(learningAgent);
  updateTerritory(learningAgent);

  return learningAgent;
};

export { updateEnvironment };

import { Agent, Food, EnvironmentState } from '../types';

export const makeDecision = (agent: Agent, state: EnvironmentState): string => {
  const nearestFood = findNearestFood(agent, state.food);
  const nearestPrey = agent.state.isPredator ? findNearestPrey(agent, state.agents) : null;
  const nearestPredator = !agent.state.isPredator ? findNearestPredator(agent, state.agents) : null;

  const inputs = [
    agent.state.energy / agent.state.maxEnergy,
    nearestFood ? distanceTo(agent, nearestFood) / agent.state.sensoryRange : 1,
    nearestPredator ? distanceTo(agent, nearestPredator) / agent.state.sensoryRange : 1,
    nearestPrey ? distanceTo(agent, nearestPrey) / agent.state.sensoryRange : 1,
    agent.state.isPredator ? 1 : 0,
    Math.sin(agent.state.angle),
    Math.cos(agent.state.angle),
    state.environmentalFactor,
    agent.experience / 100,
    agent.genome.curiosity
  ];

  const output = agent.brain.forward(inputs);
  const [flee, hunt, explore, socialize, eat] = output;

  if (flee > 0.5 && nearestPredator) {
    return 'flee';
  } else if (hunt > 0.5 && agent.state.isPredator && nearestPrey) {
    return 'hunt';
  } else if (explore > 0.5) {
    return 'explore';
  } else if (socialize > 0.5 && findNearestAgent(agent, state.agents)) {
    return 'socialize';
  } else if (eat > 0.5 && nearestFood) {
    return 'eat';
  }

  return 'explore'; // Default behavior
};

export const findNearestFood = (agent: Agent, food: Food[]): Food | null => {
  return food.reduce<{ food: Food | null; distance: number }>((nearest, f) => {
    const distance = distanceTo(agent, f);
    return distance < nearest.distance ? { food: f, distance } : nearest;
  }, { food: null, distance: Infinity }).food;
};

export const findNearestPrey = (predator: Agent, agents: Agent[]): Agent | null => {
  return agents.reduce<{ prey: Agent | null; distance: number }>((nearest, agent) => {
    if (!agent.state.isPredator) {
      const distance = distanceTo(predator, agent);
      return distance < nearest.distance ? { prey: agent, distance } : nearest;
    }
    return nearest;
  }, { prey: null, distance: Infinity }).prey;
};

export const findNearestPredator = (prey: Agent, agents: Agent[]): Agent | null => {
  return agents.reduce<{ predator: Agent | null; distance: number }>((nearest, agent) => {
    if (agent.state.isPredator) {
      const distance = distanceTo(prey, agent);
      return distance < nearest.distance ? { predator: agent, distance } : nearest;
    }
    return nearest;
  }, { predator: null, distance: Infinity }).predator;
};

export const findNearestAgent = (agent: Agent, agents: Agent[]): Agent | null => {
  return agents.reduce<{ nearestAgent: Agent | null; distance: number }>((nearest, otherAgent) => {
    if (otherAgent !== agent) {
      const distance = distanceTo(agent, otherAgent);
      return distance < nearest.distance ? { nearestAgent: otherAgent, distance } : nearest;
    }
    return nearest;
  }, { nearestAgent: null, distance: Infinity }).nearestAgent;
};

const distanceTo = (a: { state: { x: number; y: number } }, b: { x: number; y: number } | { state: { x: number; y: number } }): number => {
  const bx = 'state' in b ? b.state.x : b.x;
  const by = 'state' in b ? b.state.y : b.y;
  return Math.hypot(a.state.x - bx, a.state.y - by);
};

import { Agent, EnvironmentState, Obstacle } from '../types';

export const moveAgentTowardsTarget = (agent: Agent, target: { x: number; y: number }, state: EnvironmentState) => {
  const dx = (target.x - agent.state.x) * agent.state.movementSpeed * 0.1;
  const dy = (target.y - agent.state.y) * agent.state.movementSpeed * 0.1;
  const newX = Math.max(0, Math.min(state.width, agent.state.x + dx));
  const newY = Math.max(0, Math.min(state.height, agent.state.y + dy));
  
  const collision = checkCollision(newX, newY, state.obstacles);

  if (!collision) {
    agent.state.x = newX;
    agent.state.y = newY;
  }
};

export const fleeFromPredator = (agent: Agent, predator: Agent, state: EnvironmentState) => {
  const dx = (agent.state.x - predator.state.x) * agent.state.movementSpeed * 0.1;
  const dy = (agent.state.y - predator.state.y) * agent.state.movementSpeed * 0.1;
  const newX = Math.max(0, Math.min(state.width, agent.state.x + dx));
  const newY = Math.max(0, Math.min(state.height, agent.state.y + dy));
  
  const collision = checkCollision(newX, newY, state.obstacles);

  if (!collision) {
    agent.state.x = newX;
    agent.state.y = newY;
  }
};

export const exploreRandomly = (agent: Agent, state: EnvironmentState) => {
  const angle = Math.random() * 2 * Math.PI;
  const dx = Math.cos(angle) * agent.state.movementSpeed;
  const dy = Math.sin(angle) * agent.state.movementSpeed;
  const newX = Math.max(0, Math.min(state.width, agent.state.x + dx));
  const newY = Math.max(0, Math.min(state.height, agent.state.y + dy));
  
  const collision = checkCollision(newX, newY, state.obstacles);

  if (!collision) {
    agent.state.x = newX;
    agent.state.y = newY;
  }
};

const checkCollision = (x: number, y: number, obstacles: Obstacle[]): boolean => {
  return obstacles.some(obstacle => 
    x > obstacle.x && x < obstacle.x + obstacle.width &&
    y > obstacle.y && y < obstacle.y + obstacle.height
  );
};

import { EnvironmentState, Agent, Food, Obstacle } from './types';
import { createAgent, createFood, createObstacle } from './createEntities';

export const initialAgents = 20;
export const initialFoodCount = 50;
export const initialObstacleCount = 5;

export const initialState: EnvironmentState = {
  width: 800,
  height: 600,
  agents: Array.from({ length: initialAgents }, () => createAgent(
    Math.random() * 800,
    Math.random() * 600
  )) as Agent[],
  food: Array.from({ length: initialFoodCount }, () => createFood(800, 600)) as Food[],
  obstacles: Array.from({ length: initialObstacleCount }, () => createObstacle(800, 600)) as Obstacle[],
  totalEnergy: 0,
  maxEnergy: 1000,
  time: 0,
  environmentalFactor: 0
};

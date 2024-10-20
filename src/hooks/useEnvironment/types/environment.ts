import { Agent } from './agent';

export interface Food {
  x: number;
  y: number;
  energy: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnvironmentState {
  agents: Agent[];
  food: Food[];
  obstacles: Obstacle[];
  width: number;
  height: number;
  time: number;
  totalEnergy: number;
  maxEnergy: number;
  environmentalFactor: number;
}

export interface Environment {
  state: EnvironmentState;
  dispatch: React.Dispatch<EnvironmentAction>;
  update: () => void;
}

export type EnvironmentAction =
  | { type: 'UPDATE' }
  | { type: 'ADD_AGENT'; agent: Agent }
  | { type: 'REMOVE_AGENT'; agentId: string }
  | { type: 'ADD_FOOD'; food: Food }
  | { type: 'REMOVE_FOOD'; index: number }
  | { type: 'UPDATE_AGENTS'; agents: Agent[] }
  | { type: 'UPDATE_OBSTACLES'; obstacles: Obstacle[] }
  | { type: 'UPDATE_TOTAL_ENERGY'; totalEnergy: number }
  | { type: 'UPDATE_MAX_ENERGY'; maxEnergy: number }
  | { type: 'INCREMENT_TIME' }
  | { type: 'UPDATE_ENVIRONMENTAL_FACTOR'; factor: number }
  | { type: 'RESET' }
  | { type: 'UPDATE_PARAMS'; params: Partial<EnvironmentState> }
  | { type: 'LOAD_STATE'; state: EnvironmentState }
  | { type: 'updateAgents'; agents: Agent[] }
  | { type: 'addFood'; food: Food }
  | { type: 'updateTotalEnergy'; totalEnergy: number }
  | { type: 'updateMaxEnergy'; maxEnergy: number }
  | { type: 'incrementTime' }
  | { type: 'updateEnvironmentalFactor'; factor: number };

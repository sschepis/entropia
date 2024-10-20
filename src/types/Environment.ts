import { Agent } from './Agent';

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
  width: number;
  height: number;
  agents: Agent[];
  food: Food[];
  obstacles: Obstacle[];
  totalEnergy: number;
  maxEnergy: number;
  time: number;
}

export type EnvironmentAction =
  | { type: 'addAgent'; payload: Agent }
  | { type: 'removeAgent'; payload: { id: string } }
  | { type: 'updateAgents'; payload: Agent[] }
  | { type: 'addFood'; payload: Food }
  | { type: 'removeFood'; payload: Food }
  | { type: 'updateObstacles'; payload: Obstacle[] }
  | { type: 'updateTotalEnergy'; payload: number }
  | { type: 'updateMaxEnergy'; payload: number }
  | { type: 'incrementTime' }
  | { type: 'reset' }
  | { type: 'updateParams'; payload: Partial<EnvironmentState> }
  | { type: 'loadState'; payload: EnvironmentState };

export interface Environment {
  state: EnvironmentState;
  dispatch: (action: EnvironmentAction) => void;
  update: () => void;
}

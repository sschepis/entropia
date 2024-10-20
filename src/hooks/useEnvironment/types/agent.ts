import { Agent as AgentType } from '../../../types/Agent';

export type Agent = AgentType & {
  distanceTo: (other: Agent | { x: number; y: number }) => number;
};

export interface AgentState {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  angle: number;
  energy: number;
  previousEnergy: number;
  maxEnergy: number;
  speed: number;
  size: number;
  camouflage: number;
  sensoryRange: number;
  mouthSize: number;
  isPredator: boolean;
  energyEfficiency: number;
  movementSpeed: number;
  sensorRange: number;
  territoryCenterX: number;
  territoryCenterY: number;
  territoryRadius: number;
  territoryStrength: number;
}

export type AgentAction = {
  type: string;
  payload?: any;
};

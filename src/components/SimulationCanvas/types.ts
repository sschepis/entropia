import { Environment as EnvironmentType } from '../../types/Environment';
import { Agent } from '../../types/Agent';

export interface SimulationCanvasProps {
  width: number;
  height: number;
  environment: EnvironmentType;
  onAgentSelect: (agent: Agent | null) => void;
}

export interface ViewportState {
  offset: { x: number; y: number };
  zoom: number;
}

export const MINI_MAP_SIZE = 150;
export const MINI_MAP_PADDING = 10;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 5;

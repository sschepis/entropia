import { NeuralNetwork } from '../hooks/useEnvironment/types';

export interface AgentState {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  energy: number;
  previousEnergy: number;
  maxEnergy: number;
  energyEfficiency: number;
  movementSpeed: number;
  sensorRange: number;
  angle: number;
  size: number;
  camouflage: number;
  sensoryRange: number;
  mouthSize: number;
  isPredator: boolean;
}

export interface Agent {
  id: string;
  state: AgentState;
  brain: NeuralNetwork;
  genome: {
    speed: number;
    size: number;
    camouflage: number;
    sensoryRange: number;
    energyEfficiency: number;
    robustness: number;
    scaleIntegration: number;
    goalDirectedness: number;
    memoryUtilization: number;
    emergentBehavior: number;
    autonomy: number;
    transferLearning: number;
    feedbackIntegration: number;
    selfModeling: number;
    territorialAwareness: number;
    aggressionLevel: number;
    cooperationLevel: number;
    curiosity: number;
    adaptability: number;
    resourceEfficiency: number;
    reproductionThreshold: number;
    mutationRate: number;
    learningRate: number;
    brainStructure: number[];
  };
  history: {
    energy: number[];
    energyEfficiency: number[];
    speed: number[];
    size: number[];
    camouflage: number[];
    sensoryRange: number[];
    movementSpeed: number[];
    sensorRange: number[];
  };
  experience: number;
  age: number;
  offspring: number;
  mouthOpen: boolean;
  lastAction: any | null;
  lastReward: number;
  connectedOrganisms: Agent[];
  aggregationFrames: number;
  pack: { leader: Agent; members: Agent[] } | null;
  speciesId: number;
  performAction: (action: any) => void;
  trail: { x: number; y: number }[]; // Add this line
}

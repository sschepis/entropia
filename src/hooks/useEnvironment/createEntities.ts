import { Agent, AgentState, Food, Obstacle, NeuralNetwork, AgentAction } from './types';
import { v4 as uuidv4 } from 'uuid';

// Add these constants
const MAX_SPEED = 5;
const MIN_SIZE = 5;
const MAX_SIZE = 20;
const MAX_CAMOUFLAGE = 1;
const MIN_SENSORY_RANGE = 50;
const MAX_SENSORY_RANGE = 200;
const TERRITORY_RADIUS = 100;

class SimpleNeuralNetwork implements NeuralNetwork {
  inputLayer: number[];
  hiddenLayers: number[][];
  outputLayer: number[];
  weights: number[][][];
  biases: number[][];

  constructor(layers: number[]) {
    if (layers.length < 2) {
      throw new Error("At least two layers (input and output) are required");
    }

    this.inputLayer = new Array(layers[0]).fill(0);
    this.hiddenLayers = layers.slice(1, -1).map(size => new Array(size).fill(0));
    this.outputLayer = new Array(layers[layers.length - 1]).fill(0);

    // Initialize weights and biases
    this.weights = [];
    this.biases = [];

    for (let i = 0; i < layers.length - 1; i++) {
      this.weights.push(
        Array.from({ length: layers[i + 1] }, () =>
          Array.from({ length: layers[i] }, () => Math.random() * 2 - 1)
        )
      );
      this.biases.push(Array.from({ length: layers[i + 1] }, () => Math.random() * 2 - 1));
    }
  }

  forward(input: number[]): number[] {
    let currentLayer = input;
    for (let i = 0; i < this.weights.length; i++) {
      const nextLayer = [];
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        for (let k = 0; k < this.weights[i][j].length; k++) {
          sum += this.weights[i][j][k] * currentLayer[k];
        }
        nextLayer.push(Math.tanh(sum));
      }
      currentLayer = nextLayer;
    }
    return currentLayer;
  }

  backward(target: number[], learningRate: number): void {
    // Simplified backpropagation for demonstration purposes
    // In a real implementation, this would be more complex
    const output = this.forward(this.inputLayer);
    const outputError = target.map((t, i) => t - output[i]);

    for (let i = this.weights.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] += learningRate * outputError[j] * this.inputLayer[k];
        }
        this.biases[i][j] += learningRate * outputError[j];
      }
    }
  }

  mutate(mutationRate: number): void {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          if (Math.random() < mutationRate) {
            this.weights[i][j][k] += (Math.random() * 2 - 1) * 0.1;
          }
        }
        if (Math.random() < mutationRate) {
          this.biases[i][j] += (Math.random() * 2 - 1) * 0.1;
        }
      }
    }
  }

  copy(): NeuralNetwork {
    const newNN = new SimpleNeuralNetwork(this.getLayers());
    newNN.weights = this.weights.map(layer => layer.map(neuron => [...neuron]));
    newNN.biases = this.biases.map(layer => [...layer]);
    return newNN;
  }

  private getLayers(): number[] {
    return [this.inputLayer.length, ...this.hiddenLayers.map(layer => layer.length), this.outputLayer.length];
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }
}

export const createAgent = (x: number, y: number, isPredator: boolean = false): Agent => ({
  id: uuidv4(),
  state: {
    x,
    y,
    previousX: x,
    previousY: y,
    angle: Math.random() * Math.PI * 2,
    energy: 1.0,
    previousEnergy: 1.0,
    maxEnergy: 2.0,
    speed: Math.random() * MAX_SPEED,
    size: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
    camouflage: Math.random() * MAX_CAMOUFLAGE,
    sensoryRange: MIN_SENSORY_RANGE + Math.random() * (MAX_SENSORY_RANGE - MIN_SENSORY_RANGE),
    mouthSize: 0,
    isPredator,
    energyEfficiency: Math.random(),
    movementSpeed: Math.random() * MAX_SPEED,
    sensorRange: MIN_SENSORY_RANGE + Math.random() * (MAX_SENSORY_RANGE - MIN_SENSORY_RANGE),
    territoryCenterX: x,
    territoryCenterY: y,
    territoryRadius: TERRITORY_RADIUS,
    territoryStrength: 0,
  },
  genome: {
    speed: Math.random(),
    size: Math.random(),
    camouflage: Math.random(),
    sensoryRange: Math.random(),
    energyEfficiency: 0.5 + Math.random() * 0.5,
    robustness: Math.random(),
    scaleIntegration: Math.random(),
    goalDirectedness: Math.random(),
    memoryUtilization: 0.2 + Math.random() * 0.8,
    emergentBehavior: Math.random(),
    autonomy: 0.2 + Math.random() * 0.8,
    transferLearning: Math.random(),
    feedbackIntegration: Math.random(),
    selfModeling: Math.random(),
    territorialAwareness: Math.random(),
    aggressionLevel: Math.random(),
    cooperationLevel: Math.random(),
    curiosity: Math.random(),
    adaptability: 0.2 + Math.random() * 0.8,
    resourceEfficiency: 0.5 + Math.random() * 0.5,
    reproductionThreshold: 0.6 + Math.random() * 0.3,
    mutationRate: 0.01 + Math.random() * 0.09,
    learningRate: 0.001 + Math.random() * 0.099,
    brainStructure: [10, 20, 15, 5],
  },
  history: {
    energy: [1.0],
    energyEfficiency: [0.5],
    speed: [MAX_SPEED / 2],
    size: [(MAX_SIZE + MIN_SIZE) / 2],
    camouflage: [MAX_CAMOUFLAGE / 2],
    sensoryRange: [(MAX_SENSORY_RANGE + MIN_SENSORY_RANGE) / 2],
    movementSpeed: [MAX_SPEED / 2],
    sensorRange: [(MAX_SENSORY_RANGE + MIN_SENSORY_RANGE) / 2],
  },
  brain: new SimpleNeuralNetwork([10, 20, 15, 5]),
  shortTermMemory: [],
  longTermMemory: [],
  experience: 0,
  age: 0,
  offspring: 0,
  mouthOpen: false,
  lastAction: null,
  lastReward: 0,
  connectedOrganisms: [],
  aggregationFrames: 0,
  pack: null,
  speciesId: Math.random(),
  performAction: (action: AgentAction) => {
    console.log('Agent performing action:', action);
  }
});

export const createFood = (width: number, height: number): Food => ({
  x: Math.random() * width,
  y: Math.random() * height,
  energy: Math.random() * 0.5 + 0.5,
});

export const createObstacle = (width: number, height: number): Obstacle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  width: Math.random() * 50 + 10,
  height: Math.random() * 50 + 10,
});

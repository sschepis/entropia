export interface NeuralNetwork {
  inputLayer: number[];
  hiddenLayers: number[][];
  outputLayer: number[];
  weights: number[][][];
  biases: number[][];
  forward: (input: number[]) => number[];
  backward: (target: number[], learningRate: number) => void;
  mutate: (mutationRate: number) => void;
}

import { Agent, AgentState, AgentAction } from '../types/Agent';
import { Environment } from '../types/Environment';

// Simple Q-learning implementation
export class QLearning {
  private qTable: { [state: string]: { [action: string]: number } };
  private learningRate: number;
  private discountFactor: number;
  private explorationRate: number;

  constructor(learningRate = 0.1, discountFactor = 0.9, explorationRate = 0.1) {
    this.qTable = {};
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explorationRate = explorationRate;
  }

  private getStateKey(state: AgentState): string {
    // Simplify state representation for Q-table key
    return `${Math.floor(state.x / 10)},${Math.floor(state.y / 10)},${Math.floor(state.energy / 10)}`;
  }

  private getActionKey(action: AgentAction): string {
    return `${action.type}:${JSON.stringify(action.payload)}`;
  }

  private getQValue(state: AgentState, action: AgentAction): number {
    const stateKey = this.getStateKey(state);
    const actionKey = this.getActionKey(action);
    if (!this.qTable[stateKey]) {
      this.qTable[stateKey] = {};
    }
    if (!this.qTable[stateKey][actionKey]) {
      this.qTable[stateKey][actionKey] = 0;
    }
    return this.qTable[stateKey][actionKey];
  }

  private setQValue(state: AgentState, action: AgentAction, value: number): void {
    const stateKey = this.getStateKey(state);
    const actionKey = this.getActionKey(action);
    if (!this.qTable[stateKey]) {
      this.qTable[stateKey] = {};
    }
    this.qTable[stateKey][actionKey] = value;
  }

  public chooseAction(state: AgentState, possibleActions: AgentAction[]): AgentAction {
    if (Math.random() < this.explorationRate) {
      // Explore: choose a random action
      return possibleActions[Math.floor(Math.random() * possibleActions.length)];
    } else {
      // Exploit: choose the best action based on Q-values
      let bestAction = possibleActions[0];
      let bestValue = this.getQValue(state, bestAction);
      for (const action of possibleActions) {
        const value = this.getQValue(state, action);
        if (value > bestValue) {
          bestValue = value;
          bestAction = action;
        }
      }
      return bestAction;
    }
  }

  public update(state: AgentState, action: AgentAction, reward: number, nextState: AgentState, possibleNextActions: AgentAction[]): void {
    const currentQ = this.getQValue(state, action);
    const maxNextQ = Math.max(...possibleNextActions.map(a => this.getQValue(nextState, a)));
    const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ);
    this.setQValue(state, action, newQ);
  }
}

export const applyLearning = (agent: Agent, environment: Environment): Agent => {
  const learningAlgorithm = new QLearning();
  
  const possibleActions: AgentAction[] = [
    { type: 'move', payload: { dx: 1, dy: 0 } },
    { type: 'move', payload: { dx: -1, dy: 0 } },
    { type: 'move', payload: { dx: 0, dy: 1 } },
    { type: 'move', payload: { dx: 0, dy: -1 } },
  ];

  const chosenAction = learningAlgorithm.chooseAction(agent.state, possibleActions);
  
  // Calculate reward based on energy change
  const previousEnergy = agent.state.energy;
  agent.performAction(chosenAction);
  const reward = agent.state.energy - previousEnergy;

  learningAlgorithm.update(agent.state, chosenAction, reward, agent.state, possibleActions);

  return agent;
};

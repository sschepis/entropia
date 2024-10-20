import { EnvironmentState, EnvironmentAction, Agent, Food, Obstacle } from './types';

export const environmentReducer = (state: EnvironmentState, action: EnvironmentAction): EnvironmentState => {
  switch (action.type) {
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.agent] };
    case 'REMOVE_AGENT':
      return { ...state, agents: state.agents.filter(agent => agent.id !== action.agentId) };
    case 'UPDATE_AGENTS':
      return { ...state, agents: action.agents };
    case 'ADD_FOOD':
      return { ...state, food: [...state.food, action.food] };
    case 'REMOVE_FOOD':
      return { ...state, food: state.food.filter((_, index) => index !== action.index) };
    case 'UPDATE_OBSTACLES':
      return { ...state, obstacles: action.obstacles };
    case 'UPDATE_TOTAL_ENERGY':
      return { ...state, totalEnergy: action.totalEnergy };
    case 'UPDATE_MAX_ENERGY':
      return { ...state, maxEnergy: action.maxEnergy };
    case 'INCREMENT_TIME':
      return { ...state, time: state.time + 1 };
    case 'UPDATE_ENVIRONMENTAL_FACTOR':
      return { ...state, environmentalFactor: action.factor };
    case 'RESET':
      return { ...state, agents: [], food: [], time: 0 };
    case 'UPDATE_PARAMS':
      return { ...state, ...action.params };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
};

import { EnvironmentState, EnvironmentAction, Agent } from '../types';
import { applyEvolution } from '../../../utils/evolution';
import { createAgent, createFood } from '../createEntities';
import { initialAgents, initialFoodCount } from '../initialState';
import { updateAgent } from './agentUpdate';

const ENVIRONMENTAL_VARIABILITY = 0.2;

export const updateEnvironment = (state: EnvironmentState, dispatch: React.Dispatch<EnvironmentAction>) => {
  const environmentalFactor = Math.sin(state.time / 100) * ENVIRONMENTAL_VARIABILITY;
  
  let updatedAgents = state.agents.map(agent => updateAgent(agent as Agent, state, environmentalFactor));

  updatedAgents = updatedAgents.filter(agent => agent.state.energy > 0);
  updatedAgents = applyEvolution(updatedAgents) as Agent[];

  while (updatedAgents.length < initialAgents / 2) {
    const newAgent = createAgent(Math.random() * state.width, Math.random() * state.height);
    updatedAgents.push(newAgent);
  }

  dispatch({ type: 'updateAgents', payload: updatedAgents });

  if (state.food.length < initialFoodCount / 2) {
    dispatch({
      type: 'addFood',
      payload: createFood(state.width, state.height),
    });
  }

  const newTotalEnergy = updatedAgents.reduce((sum, agent) => sum + agent.state.energy, 0) +
    state.food.reduce((sum, food) => sum + food.energy, 0);
  
  dispatch({ type: 'updateTotalEnergy', payload: newTotalEnergy });

  if (newTotalEnergy > state.maxEnergy) {
    dispatch({ type: 'updateMaxEnergy', payload: newTotalEnergy });
  }

  dispatch({ type: 'incrementTime' });
  dispatch({ type: 'updateEnvironmentalFactor', payload: environmentalFactor });
};

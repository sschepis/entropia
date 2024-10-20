import { Environment } from '../types/Environment';

export interface SimulationState {
  environment: Environment;
  // Add any other necessary state properties
}

export const saveState = (state: SimulationState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('simulationState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const loadState = (): SimulationState | undefined => {
  try {
    const serializedState = localStorage.getItem('simulationState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const clearSavedState = (): void => {
  try {
    localStorage.removeItem('simulationState');
  } catch (err) {
    console.error('Error clearing saved state:', err);
  }
};

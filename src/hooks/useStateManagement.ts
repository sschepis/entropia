import { useCallback } from 'react';
import { Environment, EnvironmentAction } from '../types/Environment';

interface UseStateManagementProps {
  environment: Environment;
  setEnvironment: (action: EnvironmentAction) => void;
}

const useStateManagement = ({ environment, setEnvironment }: UseStateManagementProps) => {
  const saveSimulation = useCallback(() => {
    localStorage.setItem('simulationState', JSON.stringify(environment.state));
  }, [environment]);

  const loadSimulation = useCallback(() => {
    const savedState = localStorage.getItem('simulationState');
    if (savedState) {
      setEnvironment({ type: 'loadState', payload: JSON.parse(savedState) });
    }
  }, [setEnvironment]);

  const clearSavedSimulation = useCallback(() => {
    localStorage.removeItem('simulationState');
  }, []);

  return {
    saveSimulation,
    loadSimulation,
    clearSavedSimulation,
  };
};

export default useStateManagement;

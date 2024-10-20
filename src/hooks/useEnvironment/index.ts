import { useReducer, useCallback } from 'react';
import { Environment, EnvironmentState, EnvironmentAction } from './types';
import { initialState } from './initialState';
import { environmentReducer } from './reducer';
import { updateEnvironment } from './updateLogic';

const useEnvironment = (): Environment => {
  const [state, dispatch] = useReducer(environmentReducer, initialState);

  const update = useCallback(() => {
    updateEnvironment(state, dispatch);
  }, [state]);

  return {
    state,
    dispatch,
    update,
  };
};

export default useEnvironment;
export type { EnvironmentState, EnvironmentAction };

import { useState, useCallback } from 'react';
import { Agent, AgentState, AgentAction } from '../types/Agent';

const useAgent = (initialState: AgentState, id: string): Agent => {
  const [state, setState] = useState<AgentState>(initialState);

  const performAction = useCallback((action: AgentAction) => {
    switch (action.type) {
      case 'move':
        setState(prevState => ({
          ...prevState,
          x: prevState.x + action.payload.dx,
          y: prevState.y + action.payload.dy,
        }));
        break;
      case 'eat':
        setState(prevState => ({
          ...prevState,
          energy: prevState.energy + action.payload.foodEnergy,
        }));
        break;
      case 'reproduce':
        setState(prevState => ({
          ...prevState,
          energy: prevState.energy - action.payload.offspringEnergy,
        }));
        break;
      default:
        console.warn(`Unknown action type: ${(action as any).type}`);
    }
  }, []);

  return {
    id,
    state,
    performAction,
  };
};

export default useAgent;

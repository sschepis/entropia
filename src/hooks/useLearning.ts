import { useState, useCallback } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { applyLearning } from '../utils/learning';

const useLearning = (agent: Agent, environment: Environment) => {
  const [learningIteration, setLearningIteration] = useState(0);

  const learn = useCallback(() => {
    const updatedAgent = applyLearning(agent, environment);
    setLearningIteration(prev => prev + 1);
    return updatedAgent;
  }, [agent, environment]);

  return { learn, learningIteration };
};

export default useLearning;

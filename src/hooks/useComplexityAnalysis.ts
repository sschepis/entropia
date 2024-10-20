import { useState, useEffect } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { analyzeComplexity } from '../utils/complexityAnalysis';

const useComplexityAnalysis = (agents: Agent[], environment: Environment) => {
  const [complexityScores, setComplexityScores] = useState<number[]>([]);

  useEffect(() => {
    const updateComplexity = () => {
      const newScores = agents.map(agent => analyzeComplexity(agent, environment));
      setComplexityScores(newScores);
    };

    const intervalId = setInterval(updateComplexity, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [agents, environment]);

  const averageComplexity = complexityScores.length > 0
    ? complexityScores.reduce((sum, score) => sum + score, 0) / complexityScores.length
    : 0;

  return {
    complexityScores,
    averageComplexity,
  };
};

export default useComplexityAnalysis;

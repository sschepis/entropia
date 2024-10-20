import { useState, useEffect } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { analyzeInformationProcessing } from '../utils/informationProcessing';

const useInformationProcessing = (agents: Agent[], environment: Environment) => {
  const [informationScores, setInformationScores] = useState<number[]>([]);

  useEffect(() => {
    const updateInformationProcessing = () => {
      const newScores = agents.map(agent => analyzeInformationProcessing(agent, environment));
      setInformationScores(newScores);
    };

    const intervalId = setInterval(updateInformationProcessing, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [agents, environment]);

  const averageInformationProcessing = informationScores.length > 0
    ? informationScores.reduce((sum, score) => sum + score, 0) / informationScores.length
    : 0;

  return {
    informationScores,
    averageInformationProcessing,
  };
};

export default useInformationProcessing;

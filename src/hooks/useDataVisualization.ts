import { useState, useEffect } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { calculateIntelligence, calculateSubjectiveExperience, calculateSynchronization } from '../utils/intelligenceMeasurement';
import { analyzeComplexity } from '../utils/complexityAnalysis';
import { calculateLearningCapacity } from '../utils/calculateLearningCapacity';

interface IntelligenceData {
  intelligence: number[];
  subjectiveExperience: number[];
  synchronization: number[];
  complexity: number[];
  learningCapacity: number[];
}

const useDataVisualization = (agents: Agent[], environment: Environment) => {
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceData>({
    intelligence: [],
    subjectiveExperience: [],
    synchronization: [],
    complexity: [],
    learningCapacity: [],
  });

  useEffect(() => {
    const updateIntelligenceData = () => {
      const newData = agents.reduce(
        (acc, agent) => {
          acc.intelligence.push(calculateIntelligence(agent, environment));
          acc.subjectiveExperience.push(calculateSubjectiveExperience(agent, environment));
          acc.synchronization.push(calculateSynchronization(agent, environment));
          acc.complexity.push(analyzeComplexity(agent, environment));
          acc.learningCapacity.push(calculateLearningCapacity(agent, environment));
          return acc;
        },
        {
          intelligence: [] as number[],
          subjectiveExperience: [] as number[],
          synchronization: [] as number[],
          complexity: [] as number[],
          learningCapacity: [] as number[],
        }
      );

      setIntelligenceData(prevData => ({
        intelligence: [...prevData.intelligence, average(newData.intelligence)],
        subjectiveExperience: [...prevData.subjectiveExperience, average(newData.subjectiveExperience)],
        synchronization: [...prevData.synchronization, average(newData.synchronization)],
        complexity: [...prevData.complexity, average(newData.complexity)],
        learningCapacity: [...prevData.learningCapacity, average(newData.learningCapacity)],
      }));
    };

    const intervalId = setInterval(updateIntelligenceData, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [agents, environment]);

  return { intelligenceData };
};

const average = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;

export default useDataVisualization;

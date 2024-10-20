import { useState, useEffect } from 'react';
import { Agent } from '../types/Agent';
import { Environment } from '../types/Environment';
import { calculateIntelligence } from '../utils/intelligenceMeasurement';

interface IntelligenceMeasurement {
  intelligence: number;
  history: number[];
}

const useIntelligenceMeasurement = (agent: Agent, environment: Environment) => {
  const [measurement, setMeasurement] = useState<IntelligenceMeasurement>({
    intelligence: 0,
    history: [],
  });

  useEffect(() => {
    const updateIntelligence = () => {
      const newIntelligence = calculateIntelligence(agent, environment);
      setMeasurement(prev => ({
        intelligence: newIntelligence,
        history: [...prev.history, newIntelligence].slice(-100), // Keep last 100 measurements
      }));
    };

    // Update intelligence every second
    const intervalId = setInterval(updateIntelligence, 1000);

    return () => clearInterval(intervalId);
  }, [agent, environment]);

  return measurement;
};

export default useIntelligenceMeasurement;

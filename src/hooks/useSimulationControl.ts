import { useState, useCallback, useRef, useEffect } from 'react';
import useEnvironment from './useEnvironment';
import { EnvironmentAction, Environment } from '../types/Environment';

export interface EnvironmentParams {
  foodSpawnRate: number;
  maxAgents: number;
  obstacleCount: number;
}

const useSimulationControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const environmentHook = useEnvironment();
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  const updateSimulation = useCallback((timestamp: number) => {
    if (!isRunning) return;

    const elapsed = timestamp - lastUpdateTime.current;
    const updateInterval = 1000 / speed;

    if (elapsed > updateInterval) {
      environmentHook.update();
      lastUpdateTime.current = timestamp;
    }

    animationFrameId.current = requestAnimationFrame(updateSimulation);
  }, [isRunning, speed, environmentHook]);

  useEffect(() => {
    if (isRunning) {
      lastUpdateTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(updateSimulation);
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning, updateSimulation]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    stop();
    environmentHook.dispatch({ type: 'reset' });
  }, [stop, environmentHook]);

  const changeSpeed = useCallback((newSpeed: number) => setSpeed(newSpeed), []);

  const updateEnvironmentParams = useCallback((params: EnvironmentParams) => {
    const updateAction: EnvironmentAction = {
      type: 'updateParams',
      payload: {
        maxEnergy: params.maxAgents * 200, // Assuming max energy per agent is 200
        obstacles: Array.from({ length: params.obstacleCount }, () => ({
          x: Math.random() * environmentHook.state.width,
          y: Math.random() * environmentHook.state.height,
          width: Math.random() * 50 + 10,
          height: Math.random() * 50 + 10,
        })),
      },
    };
    environmentHook.dispatch(updateAction);
  }, [environmentHook]);

  return {
    isRunning,
    speed,
    environment: environmentHook,
    start,
    stop,
    reset,
    changeSpeed,
    updateEnvironmentParams,
  };
};

export default useSimulationControl;

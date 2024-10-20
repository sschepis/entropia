import React, { useMemo, useCallback, useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';
import IntelligenceGraph from './components/IntelligenceGraph';
import AgentInspector from './components/AgentInspector';
import useSimulationControl, { EnvironmentParams } from './hooks/useSimulationControl';
import useDataVisualization from './hooks/useDataVisualization';
import useComplexityAnalysis from './hooks/useComplexityAnalysis';
import useInformationProcessing from './hooks/useInformationProcessing';
import useStateManagement from './hooks/useStateManagement';
import { Agent } from './types/Agent';
import './App.css';

const App: React.FC = () => {
  const {
    isRunning,
    speed,
    environment,
    start,
    stop,
    reset,
    changeSpeed,
    updateEnvironmentParams,
  } = useSimulationControl();

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const { intelligenceData } = useDataVisualization(environment.state.agents, environment);
  const { averageComplexity } = useComplexityAnalysis(environment.state.agents, environment);
  const { averageInformationProcessing } = useInformationProcessing(environment.state.agents, environment);

  const { saveSimulation, loadSimulation, clearSavedSimulation } = useStateManagement({
    environment,
    setEnvironment: environment.dispatch,
  });

  const handleEnvironmentChange = useCallback((params: EnvironmentParams) => {
    updateEnvironmentParams(params);
  }, [updateEnvironmentParams]);

  const handleAgentSelect = useCallback((agent: Agent | null) => {
    setSelectedAgent(agent);
  }, []);

  const memoizedControls = useMemo(() => (
    <SimulationControls
      isRunning={isRunning}
      speed={speed}
      onStart={start}
      onStop={stop}
      onReset={reset}
      onSpeedChange={changeSpeed}
      onEnvironmentChange={handleEnvironmentChange}
      onSave={saveSimulation}
      onLoad={loadSimulation}
      onClear={clearSavedSimulation}
    />
  ), [isRunning, speed, start, stop, reset, changeSpeed, handleEnvironmentChange, saveSimulation, loadSimulation, clearSavedSimulation]);

  const memoizedCanvas = useMemo(() => (
    <SimulationCanvas
      width={environment.state.width}
      height={environment.state.height}
      environment={environment.state}
      onAgentSelect={handleAgentSelect}
    />
  ), [environment.state, handleAgentSelect]);

  const memoizedIntelligenceGraph = useMemo(() => (
    <IntelligenceGraph data={intelligenceData} />
  ), [intelligenceData]);

  return (
    <div className="App">
      <h1>Intelligent Agent Simulation</h1>
      <div className="simulation-container">
        <div className="simulation-main">
          {memoizedCanvas}
          {memoizedControls}
        </div>
        <div className="simulation-sidebar">
          <AgentInspector agent={selectedAgent} />
          {memoizedIntelligenceGraph}
          <div className="advanced-metrics">
            <h2>Advanced Metrics</h2>
            <p>Average Complexity: {averageComplexity.toFixed(2)}</p>
            <p>Average Information Processing: {averageInformationProcessing.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

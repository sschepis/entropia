import React, { useRef, useEffect, useState } from 'react';
import { Environment as EnvironmentType } from '../types/Environment';
import { Agent } from '../types/Agent';

interface SimulationCanvasProps {
  width: number;
  height: number;
  environment: EnvironmentType;
  onAgentSelect: (agent: Agent | null) => void;
}

const MINI_MAP_SIZE = 150;
const MINI_MAP_PADDING = 10;

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ width, height, environment, onAgentSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawEnvironment = (time: number) => {
      const deltaTime = time - lastUpdateTimeRef.current;
      const interpolationFactor = Math.min(deltaTime / 16.67, 1); // Assuming 60 FPS

      ctx.clearRect(0, 0, width, height);

      // Save the current transformation state
      ctx.save();

      // Apply zoom and pan transformations
      ctx.translate(-viewportOffset.x, -viewportOffset.y);
      ctx.scale(zoom, zoom);

      // Draw food
      environment.state.food.forEach(food => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(food.x, food.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw agents
      environment.state.agents.forEach(agent => {
        const { previousX, previousY, x, y, size, isPredator, energy, maxEnergy } = agent.state;
        
        // Interpolate position
        const interpolatedX = previousX + (x - previousX) * interpolationFactor;
        const interpolatedY = previousY + (y - previousY) * interpolationFactor;

        // Draw agent body
        ctx.fillStyle = isPredator ? 'red' : 'blue';
        ctx.beginPath();
        ctx.arc(interpolatedX, interpolatedY, size, 0, 2 * Math.PI);
        ctx.fill();

        // Draw energy bar
        const energyPercentage = energy / maxEnergy;
        ctx.fillStyle = `rgb(${255 * (1 - energyPercentage)}, ${255 * energyPercentage}, 0)`;
        ctx.fillRect(interpolatedX - size, interpolatedY - size - 5, size * 2 * energyPercentage, 3);

        // Draw selection indicator
        if (agent === selectedAgent) {
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(interpolatedX, interpolatedY, size + 2, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Draw action indicators
        drawActionIndicator(ctx, agent, interpolatedX, interpolatedY, size);
      });

      // Restore the transformation state
      ctx.restore();

      // Draw mini-map
      drawMiniMap(ctx, environment, width, height);

      lastUpdateTimeRef.current = time;
      requestAnimationFrame(drawEnvironment);
    };

    requestAnimationFrame(drawEnvironment);

    return () => {
      // Clean up any resources if needed
    };
  }, [environment, width, height, selectedAgent, viewportOffset, zoom]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left + viewportOffset.x) / zoom;
    const y = (event.clientY - rect.top + viewportOffset.y) / zoom;

    const clickedAgent = environment.state.agents.find(agent => 
      Math.sqrt(Math.pow(agent.state.x - x, 2) + Math.pow(agent.state.y - y, 2)) < agent.state.size
    );

    setSelectedAgent(clickedAgent || null);
    onAgentSelect(clickedAgent || null);
  };

  const drawActionIndicator = (
    ctx: CanvasRenderingContext2D,
    agent: Agent,
    x: number,
    y: number,
    size: number
  ) => {
    const action = agent.lastAction?.type;
    if (!action) return;

    ctx.save();
    ctx.translate(x, y);

    switch (action) {
      case 'EAT':
        drawEatingIndicator(ctx, size);
        break;
      case 'REPRODUCE':
        drawReproducingIndicator(ctx, size);
        break;
      case 'DIE':
        drawDyingIndicator(ctx, size);
        break;
      // Add more cases for other actions as needed
    }

    ctx.restore();
  };

  const drawEatingIndicator = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(size + 5, 0, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawReproducingIndicator = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size - 5, -size - 5);
    ctx.lineTo(-size - 10, -size - 10);
    ctx.moveTo(-size - 5, -size - 10);
    ctx.lineTo(-size - 10, -size - 5);
    ctx.stroke();
  };

  const drawDyingIndicator = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size, size);
    ctx.moveTo(size, -size);
    ctx.lineTo(-size, size);
    ctx.stroke();
  };

  const drawMiniMap = (
    ctx: CanvasRenderingContext2D,
    environment: EnvironmentType,
    width: number,
    height: number
  ) => {
    const miniMapScale = MINI_MAP_SIZE / Math.max(environment.state.width, environment.state.height);

    // Draw mini-map background
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.fillRect(
      width - MINI_MAP_SIZE - MINI_MAP_PADDING,
      height - MINI_MAP_SIZE - MINI_MAP_PADDING,
      MINI_MAP_SIZE,
      MINI_MAP_SIZE
    );

    // Draw agents on mini-map
    environment.state.agents.forEach(agent => {
      ctx.fillStyle = agent.state.isPredator ? 'red' : 'blue';
      ctx.beginPath();
      ctx.arc(
        width - MINI_MAP_SIZE - MINI_MAP_PADDING + agent.state.x * miniMapScale,
        height - MINI_MAP_SIZE - MINI_MAP_PADDING + agent.state.y * miniMapScale,
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });

    // Draw viewport indicator
    const viewportWidth = width / zoom;
    const viewportHeight = height / zoom;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeRect(
      width - MINI_MAP_SIZE - MINI_MAP_PADDING + viewportOffset.x * miniMapScale,
      height - MINI_MAP_SIZE - MINI_MAP_PADDING + viewportOffset.y * miniMapScale,
      viewportWidth * miniMapScale,
      viewportHeight * miniMapScale
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      style={{ border: '1px solid black' }}
    />
  );
};

export default SimulationCanvas;

import React, { useRef, useEffect } from 'react';
import { Environment as EnvironmentType } from '../types/Environment';
import { drawAgent } from './Agent';

interface EnvironmentProps {
  environment: EnvironmentType;
  width: number;
  height: number;
}

const Environment: React.FC<EnvironmentProps> = ({ environment, width, height }) => {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const staticCanvas = staticCanvasRef.current;
    const dynamicCanvas = dynamicCanvasRef.current;
    if (!staticCanvas || !dynamicCanvas) return;

    const staticCtx = staticCanvas.getContext('2d');
    const dynamicCtx = dynamicCanvas.getContext('2d');
    if (!staticCtx || !dynamicCtx) return;

    // Draw static elements (background and grid)
    drawBackground(staticCtx, width, height);
    drawGrid(staticCtx, width, height);

    // Animation loop
    const animate = (time: number) => {
      if (lastUpdateTimeRef.current === 0) {
        lastUpdateTimeRef.current = time;
      }

      const deltaTime = time - lastUpdateTimeRef.current;
      const interpolationFactor = Math.min(deltaTime / 16.67, 1); // Assuming 60 FPS

      drawDynamicElements(dynamicCtx, environment, width, height, interpolationFactor);

      lastUpdateTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [environment, width, height]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={staticCanvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <canvas
        ref={dynamicCanvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
};

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const gridSize = 50;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const drawDynamicElements = (
  ctx: CanvasRenderingContext2D,
  environment: EnvironmentType,
  width: number,
  height: number,
  interpolationFactor: number
) => {
  // Clear the dynamic canvas
  ctx.clearRect(0, 0, width, height);

  // Draw food
  drawFood(ctx, environment.state.food);

  // Draw agents
  environment.state.agents.forEach(agent => drawAgent(ctx, agent, interpolationFactor));
};

const drawFood = (ctx: CanvasRenderingContext2D, food: { x: number; y: number }[]) => {
  food.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.strokeStyle = 'darkgreen';
    ctx.stroke();

    // Add a small highlight to make it look more appealing
    ctx.beginPath();
    ctx.arc(f.x - 1, f.y - 1, 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  });
};

export default Environment;

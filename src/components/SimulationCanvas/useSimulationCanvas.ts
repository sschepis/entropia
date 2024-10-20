import { useRef, useState, useCallback, useEffect } from 'react';
import { Agent } from '../../types/Agent';
import { Environment as EnvironmentType } from '../../types/Environment';
import { ViewportState } from './types';
import { handleWheel, handlePan } from './zoomPanUtils';
import { drawAgent, drawMiniMap } from './drawingUtils';

export const useSimulationCanvas = (
  width: number,
  height: number,
  environment: EnvironmentType,
  onAgentSelect: (agent: Agent | null) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const [viewportState, setViewportState] = useState<ViewportState>({
    offset: { x: 0, y: 0 },
    zoom: 1
  });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = event.clientX - lastMousePosRef.current.x;
      const dy = event.clientY - lastMousePosRef.current.y;
      setViewportState(prev => handlePan(dx, dy, prev));
      lastMousePosRef.current = { x: event.clientX, y: event.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleCanvasWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setViewportState(prev => handleWheel(event, prev, rect));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('wheel', handleCanvasWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleCanvasWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

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
      ctx.translate(-viewportState.offset.x, -viewportState.offset.y);
      ctx.scale(viewportState.zoom, viewportState.zoom);

      // Draw food
      environment.state.food.forEach(food => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(food.x, food.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw agents
      environment.state.agents.forEach(agent => {
        const { previousX, previousY, x, y } = agent.state;
        
        // Interpolate position
        const interpolatedX = previousX + (x - previousX) * interpolationFactor;
        const interpolatedY = previousY + (y - previousY) * interpolationFactor;

        drawAgent(ctx, agent, interpolatedX, interpolatedY, selectedAgent);
      });

      // Restore the transformation state
      ctx.restore();

      // Draw mini-map
      drawMiniMap(ctx, environment, width, height, viewportState);

      lastUpdateTimeRef.current = time;
      requestAnimationFrame(drawEnvironment);
    };

    requestAnimationFrame(drawEnvironment);

    return () => {
      // Clean up any resources if needed
    };
  }, [environment, width, height, selectedAgent, viewportState]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left + viewportState.offset.x) / viewportState.zoom;
    const y = (event.clientY - rect.top + viewportState.offset.y) / viewportState.zoom;

    const clickedAgent = environment.state.agents.find(agent => 
      Math.sqrt(Math.pow(agent.state.x - x, 2) + Math.pow(agent.state.y - y, 2)) < agent.state.size
    );

    setSelectedAgent(clickedAgent || null);
    onAgentSelect(clickedAgent || null);
  }, [environment, viewportState, onAgentSelect]);

  return {
    canvasRef,
    handleCanvasClick,
    isDragging: isDraggingRef.current
  };
};

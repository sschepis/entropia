import React from 'react';
import { Agent as AgentType } from '../types/Agent';

interface AgentProps {
  agent: AgentType;
}

const Agent: React.FC<AgentProps> = () => {
  // This component doesn't render anything directly
  // It will be used by the SimulationCanvas to draw agents
  return null;
};

export const drawAgent = (ctx: CanvasRenderingContext2D, agent: AgentType, interpolationFactor: number) => {
  const { x, y, previousX, previousY, energy, maxEnergy, angle, size, isPredator } = agent.state;
  const { experience, age } = agent;
  
  // Interpolate position
  const interpolatedX = previousX + (x - previousX) * interpolationFactor;
  const interpolatedY = previousY + (y - previousY) * interpolationFactor;

  // Draw trail
  drawTrail(ctx, agent, interpolatedX, interpolatedY);

  // Save the current context state
  ctx.save();
  
  // Translate to the agent's interpolated position and rotate
  ctx.translate(interpolatedX, interpolatedY);
  ctx.rotate(angle);

  // Draw the agent body
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size, size);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fillStyle = isPredator ? 'red' : 'blue';
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw energy bar
  const energyPercentage = energy / maxEnergy;
  const barWidth = size * 2;
  const barHeight = 3;
  ctx.fillStyle = `rgb(${255 * (1 - energyPercentage)}, ${255 * energyPercentage}, 0)`;
  ctx.fillRect(-barWidth / 2, -size - 8, barWidth * energyPercentage, barHeight);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(-barWidth / 2, -size - 8, barWidth, barHeight);

  // Draw experience indicator
  const expSize = 2 + (experience / 100) * 3; // Size increases with experience
  ctx.beginPath();
  ctx.arc(0, -size - 15, expSize, 0, 2 * Math.PI);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Draw age indicator
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(age.toString(), 0, size + 15);

  // Restore the context state
  ctx.restore();
};

const drawTrail = (ctx: CanvasRenderingContext2D, agent: AgentType, currentX: number, currentY: number) => {
  if (!agent.trail) {
    agent.trail = [];
  }

  // Add current position to the trail
  agent.trail.push({ x: currentX, y: currentY });

  // Limit the trail length
  const maxTrailLength = 20;
  if (agent.trail.length > maxTrailLength) {
    agent.trail.shift();
  }

  // Draw the trail
  ctx.beginPath();
  ctx.moveTo(agent.trail[0].x, agent.trail[0].y);
  for (let i = 1; i < agent.trail.length; i++) {
    ctx.lineTo(agent.trail[i].x, agent.trail[i].y);
  }
  ctx.strokeStyle = agent.state.isPredator ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
};

export default Agent;

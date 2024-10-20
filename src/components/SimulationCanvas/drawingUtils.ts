import { Agent } from '../../types/Agent';
import { Environment as EnvironmentType } from '../../types/Environment';
import { MINI_MAP_SIZE, MINI_MAP_PADDING, ViewportState } from './types';

export const drawAgent = (
  ctx: CanvasRenderingContext2D,
  agent: Agent,
  interpolatedX: number,
  interpolatedY: number,
  selectedAgent: Agent | null
) => {
  const { size, isPredator, energy, maxEnergy } = agent.state;

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
};

export const drawActionIndicator = (
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

export const drawMiniMap = (
  ctx: CanvasRenderingContext2D,
  environment: EnvironmentType,
  width: number,
  height: number,
  viewportState: ViewportState
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
  const viewportWidth = width / viewportState.zoom;
  const viewportHeight = height / viewportState.zoom;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.strokeRect(
    width - MINI_MAP_SIZE - MINI_MAP_PADDING + viewportState.offset.x * miniMapScale,
    height - MINI_MAP_SIZE - MINI_MAP_PADDING + viewportState.offset.y * miniMapScale,
    viewportWidth * miniMapScale,
    viewportHeight * miniMapScale
  );
};

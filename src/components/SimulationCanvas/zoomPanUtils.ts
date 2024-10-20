import { ViewportState, MIN_ZOOM, MAX_ZOOM } from './types';

export const handleWheel = (
  event: WheelEvent,
  viewportState: ViewportState,
  canvasRect: DOMRect
): ViewportState => {
  const zoomFactor = 1 - event.deltaY * 0.001;
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewportState.zoom * zoomFactor));
  
  const mouseX = event.clientX - canvasRect.left;
  const mouseY = event.clientY - canvasRect.top;

  const newOffsetX = (mouseX + viewportState.offset.x) * (newZoom / viewportState.zoom) - mouseX;
  const newOffsetY = (mouseY + viewportState.offset.y) * (newZoom / viewportState.zoom) - mouseY;

  return {
    offset: { x: newOffsetX, y: newOffsetY },
    zoom: newZoom
  };
};

export const handlePan = (
  dx: number,
  dy: number,
  viewportState: ViewportState
): ViewportState => {
  return {
    ...viewportState,
    offset: {
      x: viewportState.offset.x - dx,
      y: viewportState.offset.y - dy
    }
  };
};

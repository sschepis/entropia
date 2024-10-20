import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SimulationControls from './SimulationControls';

describe('SimulationControls', () => {
  const mockProps = {
    isRunning: false,
    speed: 5,
    onStart: jest.fn(),
    onStop: jest.fn(),
    onReset: jest.fn(),
    onSpeedChange: jest.fn(),
    onEnvironmentChange: jest.fn(),
    onSave: jest.fn(),
    onLoad: jest.fn(),
    onClear: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<SimulationControls {...mockProps} />);
  });

  it('displays Start button when not running', () => {
    render(<SimulationControls {...mockProps} />);
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('displays Stop button when running', () => {
    render(<SimulationControls {...mockProps} isRunning={true} />);
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('calls onStart when Start button is clicked', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.click(screen.getByText('Start'));
    expect(mockProps.onStart).toHaveBeenCalled();
  });

  it('calls onStop when Stop button is clicked', () => {
    render(<SimulationControls {...mockProps} isRunning={true} />);
    fireEvent.click(screen.getByText('Stop'));
    expect(mockProps.onStop).toHaveBeenCalled();
  });

  it('calls onReset when Reset button is clicked', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  it('calls onSpeedChange when speed slider is changed', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/Simulation Speed/i), { target: { value: '7' } });
    expect(mockProps.onSpeedChange).toHaveBeenCalledWith(7);
  });

  it('calls onEnvironmentChange when food spawn rate is changed', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.change(screen.getByLabelText('Food Spawn Rate:'), { target: { value: '0.5' } });
    expect(mockProps.onEnvironmentChange).toHaveBeenCalledWith(expect.objectContaining({ foodSpawnRate: 0.5 }));
  });

  it('calls onEnvironmentChange when max agents is changed', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.change(screen.getByLabelText('Max Agents:'), { target: { value: '100' } });
    expect(mockProps.onEnvironmentChange).toHaveBeenCalledWith(expect.objectContaining({ maxAgents: 100 }));
  });

  it('calls onSave when Save Simulation button is clicked', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.click(screen.getByText('Save Simulation'));
    expect(mockProps.onSave).toHaveBeenCalled();
  });

  it('calls onLoad when Load Simulation button is clicked', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.click(screen.getByText('Load Simulation'));
    expect(mockProps.onLoad).toHaveBeenCalled();
  });

  it('calls onClear when Clear Saved Simulation button is clicked', () => {
    render(<SimulationControls {...mockProps} />);
    fireEvent.click(screen.getByText('Clear Saved Simulation'));
    expect(mockProps.onClear).toHaveBeenCalled();
  });
});

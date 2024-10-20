import React from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

interface SparklineChartProps {
  data: number[];
  color: string;
  label: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color, label }) => {
  return (
    <div className="sparkline-chart">
      <span className="sparkline-label">{label}:</span>
      <Sparklines data={data} width={100} height={20} margin={5}>
        <SparklinesLine style={{ stroke: color, strokeWidth: 2, fill: "none" }} />
        <SparklinesSpots size={2} style={{ stroke: color, strokeWidth: 2, fill: "white" }} />
      </Sparklines>
    </div>
  );
};

export default SparklineChart;

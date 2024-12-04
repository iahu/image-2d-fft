import { lineY, plot, pointerX, ruleX, ruleY, type Data } from '@observablehq/plot';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface Props {
  data: Data;
  width?: number;
  height?: number;
  title?: ReactNode;
  sx?: number;
}

export const WaveRenderer: FC<Props> = (props) => {
  const { data, width, height, title, sx } = props;
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scaledData = sx === undefined ? data : Array.from(data).map((value, i) => ({ frequency: i * sx, value }));
    const _plot = plot({
      marks: [
        lineY(scaledData, { tip: 'xy', x: 'frequency', y: 'value' }),
        ruleY([0]),
        ruleX(scaledData, pointerX({ x: 'frequency', py: 'value', stroke: 'red' })),
      ],
      width,
      height,
    });

    canvasRef.current?.appendChild(_plot);
    return () => _plot.remove();
  }, [data, sx, width, height]);

  return (
    <div className="wave-renderer">
      <h5 style={{ color: '#444' }}>{title}</h5>
      <div ref={canvasRef}></div>
    </div>
  );
};

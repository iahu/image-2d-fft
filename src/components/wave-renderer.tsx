import { lineY, plot, pointerX, tip, type Data } from '@observablehq/plot';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface Props {
  data: Data;
  width?: number;
  height?: number;
  title?: ReactNode;
  sx?: number;
}

export const WaveRenderer: FC<Props> = (props) => {
  const { data, width, height, title, sx = 1 } = props;
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scaledData = Array.from(data).map((value, i) => ({ frequency: i * sx, value }));
    const _plot = plot({
      y: { grid: true, nice: true, inset: 5 },
      marks: [lineY(scaledData, { x: 'frequency', y: 'value' }), tip(scaledData, pointerX({ x: 'frequency', y: 'value' }))],
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

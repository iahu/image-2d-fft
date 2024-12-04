import { lineY, plot, pointerX, ruleX, tip, type Data } from '@observablehq/plot';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface Props {
  data: Data;
  width?: number;
  height?: number;
  title?: ReactNode;
  sx?: number;
  labelX?: string;
  labelY?: string;
}

export const WaveRenderer: FC<Props> = (props) => {
  const { data, width, height, title, sx = 1, labelX = 'frequency(hz)', labelY = 'value' } = props;
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scaledData = Array.from(data).map((y, i) => ({ [labelX]: i * sx, [labelY]: y }));
    const _plot = plot({
      y: { grid: true, nice: true },
      marks: [lineY(scaledData, { x: labelX, y: labelY }), tip(scaledData, pointerX({ x: labelX, y: labelY })), ruleX([0])],
      width,
      height,
    });

    canvasRef.current?.appendChild(_plot);
    return () => _plot.remove();
  }, [data, sx, width, height, labelX, labelY]);

  return (
    <div className="wave-renderer">
      <h5 style={{ color: '#444' }}>{title}</h5>
      <div ref={canvasRef}></div>
    </div>
  );
};

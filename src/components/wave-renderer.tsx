import { lineY, plot, ruleY, type Data } from '@observablehq/plot';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface Props {
  data: Data;
  width?: number;
  height?: number;
  title?: ReactNode;
}

export const WaveRenderer: FC<Props> = (props) => {
  const { data, width, height, title } = props;
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _plot = plot({
      marks: [lineY(data, { tip: 'xy' }), ruleY([0])],
      width,
      height,
    });

    canvasRef.current?.appendChild(_plot);
    return () => _plot.remove();
  }, [data, width, height]);

  return (
    <div className="wave-renderer">
      <h5 style={{ color: '#444' }}>{title}</h5>
      <div ref={canvasRef}></div>
    </div>
  );
};

import { lineY, plot } from '@observablehq/plot';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

export interface Props {
  data: ArrayLike<number>;
  width?: number;
  height?: number;
  title?: ReactNode;
}

export const WaveRenderer: FC<Props> = (props) => {
  const { data, width, height, title } = props;
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _plot = plot({
      marks: [lineY(data)],
      width,
      height,
    });

    canvasRef.current?.appendChild(_plot);
    return () => _plot.remove();
  }, [data, width, height]);

  return (
    <div className="wave-renderer">
      <h4 className="title">{title}</h4>
      <div ref={canvasRef}></div>
    </div>
  );
};

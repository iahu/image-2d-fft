import { useEffect, useRef, type CSSProperties, type FC } from 'react';

export type ResultProps = {
  className?: string;
  style?: CSSProperties;
  data: ImageData | undefined;
};

export const Result: FC<ResultProps> = (props) => {
  const { className, style, data } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = data.width;
    canvas.height = data.height;
    canvas.getContext('2d')?.putImageData(data, 0, 0);
  }, []);

  return (
    <div className={[className, 'result'].join(' ')} style={style}>
      <div className="input-box">result</div>
      <canvas ref={canvasRef} />
    </div>
  );
};

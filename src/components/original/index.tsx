import { useEffect, useRef, type CSSProperties, type FC } from 'react';

export type OriginalProps = {
  className?: string;
  style?: CSSProperties;
  data: ImageData | undefined;
};

export const Original: FC<OriginalProps> = (props) => {
  const { className, style, data } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext('2d')!;

  useEffect(() => {
    if (!data?.data) return;
    canvasRef.current!.width = data?.width;
    canvasRef.current!.height = data?.height;
    ctx.putImageData(data, 0, 0);
  }, [data]);

  return (
    <div className={[className, 'original'].join(' ')} style={style}>
      <div className="input-box">original</div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

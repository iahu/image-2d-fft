import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react';

export type MaskedProps = {
  className?: string;
  style?: CSSProperties;
  data: ImageData | undefined;
};

export const Masked: FC<MaskedProps> = (props) => {
  const { className, style, data } = props;
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

  useEffect(() => {
    if (!data || !canvas) return;

    canvas.width = data.width;
    canvas.height = data.height;
    canvas.getContext('2d')?.putImageData(data, 0, 0);
  }, [data, canvas]);

  return (
    <div className={[className, 'masked'].join(' ')} style={style}>
      <div className="input-box">masked</div>
      <canvas ref={setCanvas} />
    </div>
  );
};

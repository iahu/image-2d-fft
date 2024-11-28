import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import styles from './index.module.css';

export type RendererProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
  data: ImageData | undefined;
};

export const Renderer: FC<RendererProps> = (props) => {
  const { className, style, title, data } = props;
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

  useEffect(() => {
    if (!canvas || !data) return;

    canvas.width = data.width;
    canvas.height = data.height;
    canvas.getContext('2d')?.putImageData(data, 0, 0);
  }, [canvas, data]);

  return (
    <div className={[className, 'renderer'].join(' ')} style={style}>
      <div className={styles.title}>{title}</div>
      <canvas ref={setCanvas} />
    </div>
  );
};

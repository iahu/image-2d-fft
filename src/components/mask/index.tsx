import { useCallback, useEffect, useState, type CSSProperties, type FC } from 'react';
import './index.css';

export type MaskProps = {
  className?: string;
  style?: CSSProperties;
  data: ImageData | undefined;
  onChange?: (data: ImageData) => void;
};

const TWO_PI = Math.PI * 2;

const updateBrushSize = (n: number) => Math.min(256, Math.max(1, n));

export const Mask: FC<MaskProps> = (props) => {
  const { className, style, data, onChange } = props;
  const [brushSize, setBrushSize] = useState(60);
  const [brushColor, setBrushColor] = useState('#fff');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [circle, setCircle] = useState<SVGCircleElement | null>();

  const ctx = canvas?.getContext('2d', { willReadFrequently: true });
  const width = data?.width ?? 512;
  const height = data?.height ?? 512;
  const cWidth = canvas?.clientWidth ?? 512;
  const cHeight = canvas?.clientHeight ?? 512;
  const wRatio = width / cWidth;
  const hRatio = height / cHeight;

  const handleChange = useCallback(() => {
    if (!ctx) return;

    onChange?.(ctx.getImageData(0, 0, width, height));
  }, [ctx, height, onChange, width]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    circle?.style.removeProperty('display');
    if (!ctx) return;

    ctx.beginPath();
    ctx.fillStyle = brushColor;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.arc(offsetX * wRatio, offsetY * hRatio, brushSize, 0, TWO_PI);
    ctx.fill();
    ctx?.closePath();
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;

    circle!.setAttribute('cx', `${offsetX * wRatio}`);
    circle!.setAttribute('cy', `${offsetY * hRatio}`);

    if (!(e.target as HTMLCanvasElement).hasPointerCapture(e.pointerId)) return;
    if (!ctx) return;
    e.preventDefault();

    ctx.beginPath();
    ctx.fillStyle = brushColor;
    ctx.arc(offsetX * wRatio, offsetY * hRatio, brushSize, 0, TWO_PI);
    ctx.fill();
    ctx?.closePath();
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    handleChange();
  };
  const handlePointerEnter = () => {
    circle?.style.removeProperty('display');
  };
  const handlePointerLeave = (e: React.PointerEvent) => {
    circle?.style.setProperty('display', 'none');
    const target = e.target as HTMLCanvasElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      handleChange();
    }
  };

  useEffect(() => {
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setBrushSize((prev) => updateBrushSize(prev + e.deltaY));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'x':
          setBrushColor((prev) => (prev === '#000' ? '#fff' : '#000'));
          break;
        case '[':
          setBrushSize((prev) => updateBrushSize(prev - 3));
          break;
        case ']':
          setBrushSize((prev) => updateBrushSize(prev + 3));
          break;
        case 'i': {
          if (!e.ctrlKey) return;
          const ctx = canvas.getContext('2d')!;
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data.map((x, i) => ((i + 1) % 4 ? 255 - x : x));
          ctx.putImageData(new ImageData(data, width, height), 0, 0);
          handleChange();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvas, handleChange, height, width]);

  useEffect(() => {
    if (!ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    handleChange();
  }, [ctx, handleChange]);

  return (
    <div className={[className, 'mask'].join(' ')} style={style}>
      <div className="input-box">Mask</div>

      <div className="mask-canvas">
        <canvas
          ref={setCanvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerUp}
          width={width}
          height={height}
        />
        <svg viewBox={`0 0 ${width} ${height}`} width={cWidth} height={cHeight} className="brush" style={{ opacity: 0.8 }}>
          <circle
            ref={setCircle}
            cx="0"
            cy="0"
            r={brushSize}
            stroke="red"
            fill={`${brushColor}`}
            strokeWidth="2"
            style={{ display: 'none' }}
          ></circle>
          <line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke="gray"></line>
          <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="gray"></line>
        </svg>
      </div>
    </div>
  );
};

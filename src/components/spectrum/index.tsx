import { fft2 } from '@/fft2';
import { reshape } from '@/helpers';
import FFT from 'fft.js';
import { useEffect, useRef, type CSSProperties, type FC } from 'react';
import { buildPixels, getChannels } from './get-channels';

export type SpectrumProps = {
  className?: string;
  style?: CSSProperties;
  data: ImageData | undefined;
};

export const Spectrum: FC<SpectrumProps> = (props) => {
  const { className, style, data } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const ctx = ref.current?.getContext('2d')!;

  useEffect(() => {
    if (!data) return;
    const [r, g, b, a] = getChannels(data);
    const { width = 0, height = 0 } = data!;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    const spectrum = [r, g, b].map((c) => fft2(reshape(c, [width, height])));
    const flatSpectrum = spectrum.map((x) => x.flat());
    const fft = new FFT(flatSpectrum[0].length / 2);
    const realFlatSpectrum = flatSpectrum.map((x) => fft.fromComplexArray(x));
    const pixels = buildPixels([...realFlatSpectrum, a]);

    ctx.putImageData(new ImageData(Uint8ClampedArray.from(pixels), width, height), 0, 0);
  }, [data]);

  return (
    <div className={[className, 'spectrum'].join(' ')} style={style}>
      <div className="input-box">spectrum</div>
      <canvas ref={ref} />
    </div>
  );
};

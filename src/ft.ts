import { fft2, ifft2 } from './fft2';
import { binaryCeil, reshape, resize, shift, toRe } from './helpers';

const setupCanvas = (id: string, width: number, height: number, willReadFrequently = false) => {
  const canvas = document.querySelector<HTMLCanvasElement>(`#${id}`)!;
  const ctx = canvas?.getContext('2d', { willReadFrequently })!;
  canvas.style.setProperty('width', `${width}px`);
  canvas.style.setProperty('height', `${height}px`);
  canvas.width = width;
  canvas.height = height;

  return ctx;
};

const render = (ctx: CanvasRenderingContext2D, data: ArrayLike<number>, width: number, height: number) => {
  ctx?.putImageData(new ImageData(Uint8ClampedArray.from(data), width, height), 0, 0);
  return ctx;
};

document.querySelector('input')?.addEventListener('change', (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (files === null) return;

  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const result = e.target?.result as string;
    const image = new Image();
    image.src = result;
    image.onload = () => {
      main(image);
    };
  };
});

const main = (image: HTMLImageElement) => {
  const { width, height } = image;
  const originalCtx = setupCanvas('original', width, height);
  originalCtx?.drawImage(image, 0, 0);

  const data = originalCtx.getImageData(0, 0, width, height).data;
  const channels = data.length / width / height;
  const bWidth = binaryCeil(width);
  const cWidth = binaryCeil(width * channels);
  const cHeight = binaryCeil(height);

  const spectrumCtx = setupCanvas('spectrum', bWidth, cHeight);
  const maskCtx = setupCanvas('mask', bWidth, cHeight, true);
  const rebuildCtx = setupCanvas('rebuild', bWidth, cHeight);

  const pixels = resize(reshape(Array.from(data), [width * channels, height]), [cWidth, cHeight]);

  const resizeCtx = setupCanvas('original', bWidth, cHeight);
  render(resizeCtx, pixels.flat(), bWidth, cHeight);

  const spectrums = shift(fft2(pixels));
  const freq = toRe(spectrums.flat());

  render(spectrumCtx, freq, bWidth, cHeight);
  render(maskCtx, new Array(freq.length).fill(255), bWidth, cHeight);

  setMaskDrawer(maskCtx, (mask) => {
    const blendedData = blendMask(spectrums.flat(), mask, channels);
    const maskedSpectrums = reshape(blendedData, [spectrums[0].length, spectrums.length]);
    const rowRebuild = ifft2(shift(maskedSpectrums));
    const rebuildImageData = rowRebuild.flat();
    render(rebuildCtx, rebuildImageData, bWidth, cHeight);
  });
};

const TWO_PI = Math.PI * 2;
const setMaskDrawer = (ctx: CanvasRenderingContext2D, onDrawn?: (data: Uint8ClampedArray) => void) => {
  const canvas = ctx.canvas;

  if (canvas.dataset.hasSetup) return;

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.fillStyle = e.altKey ? '#fff' : '#000';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!canvas.hasPointerCapture(e.pointerId)) return;
    ctx.arc(e.offsetX, e.offsetY, 20, 0, TWO_PI);
    ctx.closePath();
    ctx.fill();
  });
  canvas.addEventListener('pointerup', (e) => {
    canvas.releasePointerCapture(e.pointerId);

    onDrawn?.(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  });

  onDrawn?.(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  canvas.dataset.hasSetup = 'true';
};

const blendMask = (spectrum: number[], mask: ArrayLike<number>, channels: number) => {
  const res: number[] = [];
  for (let i = 0; i < mask.length; i += channels) {
    const channelsSpectrum = spectrum.slice(2 * i, 2 * (i + channels));
    if (mask[i] > 125) {
      res.push(...channelsSpectrum);
    } else {
      res.push(0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  return res;
};

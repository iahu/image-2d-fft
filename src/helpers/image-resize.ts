import { binaryCeil } from '@/helpers';
import { createCanvas } from '@/helpers/create-canvas';

export const imageResize = (image: ImageData, maxSize = 512) => {
  const { width, height } = image;
  const clampedSize = Math.min(maxSize, Math.max(width, height));
  const powerSize = binaryCeil(clampedSize);

  const ctx = createCanvas(powerSize);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, powerSize, powerSize);
  ctx.putImageData(image, (powerSize - width) / 2, (powerSize - height) / 2);

  return ctx.getImageData(0, 0, powerSize, powerSize);
};

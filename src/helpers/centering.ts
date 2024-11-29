import { createCanvas } from '@/helpers/create-canvas';

export const centering = (image: ImageData) => {
  const { width, height } = image;
  const powerSize = 512;
  const ctx = createCanvas(powerSize);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, powerSize, powerSize);
  ctx.putImageData(image, (powerSize - width) / 2, (powerSize - height) / 2);

  return ctx.getImageData(0, 0, powerSize, powerSize);
};

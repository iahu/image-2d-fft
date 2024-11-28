export const createCanvas = (width: number, height = width) => {
  return new OffscreenCanvas(width, height).getContext('2d')!;
};

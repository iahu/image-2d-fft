export const readImage = (img: HTMLImageElement) => {
  const { naturalWidth: width, naturalHeight: height } = img;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, width, height, { colorSpace: 'display-p3' });
};

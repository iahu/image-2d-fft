export const readImage = (img: HTMLImageElement) => {
  const { naturalWidth: width, naturalHeight: height } = img;
  const max = Math.max(width, height);
  if (max > 512) {
    if (width < height && height > 512) {
      img.height = 512;
      img.width = (width * 512) / height;
    } else if (width > height && width > 512) {
      img.width = 512;
      img.height = (height * 512) / width;
    }
  }
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

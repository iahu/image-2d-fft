export const scale = (max: number, min: number, n: number) => {
  return max === min ? n : (n - min) * (255 / (max - min));
};

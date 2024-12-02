export const magnitude = (re: number, im: number) => {
  return Math.sqrt(Math.abs(re) + Math.abs(im));
};

export const magnitude2 = (re: number, im: number) => {
  return Math.sqrt(re ** 2 + im ** 2);
};

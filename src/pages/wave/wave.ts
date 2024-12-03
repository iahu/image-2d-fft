const PI2 = 2 * Math.PI;

export const wave = (frequency: number, amplitude: number, simplerate: number, bufferSize: number) => {
  const result = [];
  for (let i = 0; i < bufferSize; ++i) {
    result[i] = amplitude * Math.sin((frequency * i * PI2) / simplerate);
  }

  return result;
};

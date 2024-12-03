const deg2angle = (2 * Math.PI) / 360;
export const wave = (frequency: number, amplitude: number, bufferSize: number) => {
  const result = new Array(bufferSize);
  for (let i = 0; i < bufferSize; ++i) {
    result[i] = amplitude * Math.sin(frequency * i * deg2angle);
  }

  return result;
};

import FFT from 'fft.js';

export const getColumns = (m: number[][], cs: number[]) => {
  const column: number[] = [];
  for (let r = 0; r < m.length; ++r) {
    column.push(...cs.map((c) => m[r][c]));
  }
  return column;
};

export const fft2 = (signal: number[][]) => {
  const w = signal[0].length;
  const h = signal.length;

  const rFFT = new FFT(w);
  const cFFT = new FFT(h);

  const rowSpectrums: number[][] = [];
  for (let r = 0; r < h; ++r) {
    const out: number[] = [];
    rFFT.realTransform(out, signal[r]);
    rFFT.completeSpectrum(out);
    rowSpectrums.push(out);
  }

  const colSpectrums: number[][] = new Array(h).fill(0).map(() => []);
  for (let c = 0; c < w; ++c) {
    const complexCol = getColumns(rowSpectrums, [c * 2, c * 2 + 1]);
    const out: number[] = [];

    cFFT.transform(out, complexCol);

    for (let r = 0; r < h; ++r) {
      colSpectrums[r].push(out[2 * r], out[2 * r + 1]);
    }
  }

  return colSpectrums;
};

export const ifft2 = (spectrum: number[][]) => {
  const w = spectrum[0].length / 2;
  const h = spectrum.length;

  const rFFT = new FFT(w);
  const cFFT = new FFT(h);

  const colRebuild: number[][] = new Array(h).fill(0).map(() => []);
  for (let c = 0; c < w; ++c) {
    const complexCol = getColumns(spectrum, [c * 2, c * 2 + 1]);
    const out: number[] = [];
    cFFT.inverseTransform(out, complexCol);

    for (let r = 0; r < h; ++r) {
      colRebuild[r].push(out[2 * r], out[2 * r + 1]);
    }
  }

  const rowRebuild: number[][] = [];
  for (let r = 0; r < h; ++r) {
    const out: number[] = [];
    rFFT.inverseTransform(out, colRebuild[r]);
    rowRebuild.push(rFFT.fromComplexArray(out));
  }

  return rowRebuild;
};

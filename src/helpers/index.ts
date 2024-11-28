export const binaryCeil = (n: number) => 1 << (n - 1).toString(2).length;

export const reshape = <T = unknown>(d: T[], size: [number, number], defaultValue = 0) => {
  const [w, h] = size;
  const ret: T[][] = [];

  for (let i = 0; i < h; ++i) {
    const iw = i * w;
    const sub = d.slice(iw, iw + w);
    if (sub.length !== w) {
      const m = new Array(w - sub.length).fill(defaultValue);
      ret.push([...sub, ...m].slice(0, w));
    } else {
      ret.push(sub);
    }
  }

  return ret;
};

export const resize = (d: number[][], size: [number, number], defaultValue = 0) => {
  const [w, h] = size;
  const ret: number[][] = [];

  for (let i = 0; i < h; ++i) {
    const row = d[i] ?? [];
    if (row.length !== w) {
      const m = new Array(w - row.length).fill(defaultValue);
      ret.push([...row, ...m].slice(0, w));
    } else {
      ret.push(row);
    }
  }

  return ret;
};

export const shift = (m: number[][]) => {
  const h = m.length;
  const w = m[0].length;
  const halfW = w / 2;
  const halfH = h / 2;

  const res: number[][] = [];
  for (let i = 0; i < h; ++i) {
    const l = m[i].slice(0, halfW);
    const r = m[i].slice(halfW);
    res[(i + halfH) % h] = [...r, ...l];
  }

  return res;
};

export const toRe = (d: number[]) => {
  const re: number[] = [];
  for (let i = 0; i < d.length; i += 2) {
    re.push(d[i]);
  }
  return re;
};

export const toComplex = (re: number[], im = []) => {
  const complex: number[] = [];
  for (let i = 0; i < re.length; i += 2) {
    complex.push(re[i], im[i] ?? 0);
  }
  return complex;
};

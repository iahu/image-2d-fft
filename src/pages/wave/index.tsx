import { WaveRenderer } from '@/components/wave-renderer';
import { magnitude2 } from '@/helpers/magnitude';
import FFT from 'fft.js';
import './index.css';
import { wave } from './wave';

const SIMPLE_RATE = 1024;
const BUFFER_SIZE = 256;

const st = 1 / SIMPLE_RATE;
const sx = SIMPLE_RATE / BUFFER_SIZE;

const waveA = wave(12, 1, SIMPLE_RATE, BUFFER_SIZE);
const waveB = wave(40, 3, SIMPLE_RATE, BUFFER_SIZE);
const waveC = wave(100, 6, SIMPLE_RATE, BUFFER_SIZE);
const waveABC = waveA.map((x, i) => x + waveB[i] + waveC[i]);

const width = 320;
const height = 128;

const toMagnitude = (phasors: number[]) => {
  const res: number[] = [];
  for (let i = 0; i < phasors.length; i += 2) {
    res.push(magnitude2(phasors[i], phasors[i + 1]));
  }
  return res;
};

const transform = (signal: number[]) => {
  const fft = new FFT(signal.length);
  const out: number[] = [];
  fft.transform(out, fft.toComplexArray(signal));
  return out;
};

const invTransform = (spectrum: number[]) => {
  const fft = new FFT(spectrum.length / 2);
  const out: number[] = [];
  fft.inverseTransform(out, spectrum);
  return fft.fromComplexArray(out);
};

const index2Freq = (simpleRate: number, spectrumLength: number, i: number) => {
  if (i < spectrumLength / 2) return i * (simpleRate / spectrumLength);
  return (spectrumLength - i) * (simpleRate / spectrumLength);
};

const bandPassFilter = (spectrum: number[], simpleRate: number, low: number, hight: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;
  for (let i = 0; i < length; ++i) {
    const freq = index2Freq(simpleRate, length, i);
    const positiveBand = low < freq && freq < hight;
    if (positiveBand) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

const lowPassFilter = (spectrum: number[], simpleRate: number, frequency: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;
  for (let i = 0; i < length; ++i) {
    const freq = index2Freq(simpleRate, length, i);
    if (freq < frequency) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

const hightPassFilter = (spectrum: number[], simpleRate: number, frequency: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;
  for (let i = 0; i < length; ++i) {
    const freq = index2Freq(simpleRate, length, i);
    if (frequency < freq) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

export const Wave = () => {
  return (
    <div className="wave">
      <h2>Periodic Wave FFT filter demo</h2>
      <p>
        wave simple rate: {SIMPLE_RATE}, buffer size: {BUFFER_SIZE}
      </p>

      <h4>1. Original Waves</h4>
      <div>
        <div className="flex flex-wrap cg-20">
          <WaveRenderer sx={st} labelX="time(s)" data={waveA} width={width} height={height} title="A: frequency: 12, amplitude: 1" />
          <WaveRenderer sx={st} labelX="time(s)" data={waveB} width={width} height={height} title="B: frequency: 40, amplitude: 3" />
          <WaveRenderer sx={st} labelX="time(s)" data={waveC} width={width} height={height} title="C: frequency: 100, amplitude: 6" />
          <WaveRenderer sx={1 / SIMPLE_RATE} labelX="time(s)" data={waveABC} width={width} height={height} title="Mix: A + B + C" />
        </div>

        <hr />

        <h4>2. FFT Magnitude (half frequency range, double magnitude)</h4>
        <div className="flex flex-wrap cg-20">
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveA))} width={width} height={height} title="magnitude of FFT(A)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveB))} width={width} height={height} title="magnitude of FFT(B)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveC))} width={width} height={height} title="magnitude of FFT(C)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveABC))} width={width} height={height} title="magnitude of FFT(Mix)" />
        </div>

        <hr />

        <h4>3. Filters and Reconstruct</h4>

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(lowPassFilter(transform(waveABC), SIMPLE_RATE, 20))}
            width={width}
            height={height}
            title="lowPassFilter(20)"
          />
          <WaveRenderer
            sx={st}
            labelX="time(s)"
            data={invTransform(lowPassFilter(transform(waveABC), SIMPLE_RATE, 20))}
            width={width}
            height={height}
            title="inverseTransform (A)"
          />
        </div>

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(bandPassFilter(transform(waveABC), SIMPLE_RATE, 35, 45))}
            width={width}
            height={height}
            title="bandPassFilter(35, 45)"
          />
          <WaveRenderer
            sx={st}
            labelX="time(s)"
            data={invTransform(bandPassFilter(transform(waveABC), SIMPLE_RATE, 35, 45))}
            width={width}
            height={height}
            title="inverseTransform (B)"
          />
        </div>

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(hightPassFilter(transform(waveABC), SIMPLE_RATE, 95))}
            width={width}
            height={height}
            title="hightPassFilter(95)"
          />
          <WaveRenderer
            sx={st}
            labelX="time(s)"
            data={invTransform(hightPassFilter(transform(waveABC), SIMPLE_RATE, 95))}
            width={width}
            height={height}
            title="inverseTransform (C)"
          />
        </div>
      </div>
    </div>
  );
};

import { WaveRenderer } from '@/components/wave-renderer';
import { magnitude2 } from '@/helpers/magnitude';
import FFT from 'fft.js';
import './index.css';
import { wave } from './wave';

const SIMPLE_RATE = 256;
const BUFFER_SIZE = 512;

const sx = SIMPLE_RATE / BUFFER_SIZE;

const waveA = wave(6, 1, SIMPLE_RATE, BUFFER_SIZE);
const waveB = wave(10, 4, SIMPLE_RATE, BUFFER_SIZE);
const waveC = wave(20, 6, SIMPLE_RATE, BUFFER_SIZE);
const waveABC = waveA.map((x, i) => x + waveB[i] + waveC[i]);

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
      <p>wave simple rate: {SIMPLE_RATE}</p>

      <h4>1. Original Waves</h4>
      <div>
        <div className="flex flex-wrap cg-20">
          <WaveRenderer sx={sx} data={waveA} width={512} height={128} title="A: frequency: 6, amplitude: 1" />
          <WaveRenderer sx={sx} data={waveB} width={512} height={128} title="B: frequency: 10, amplitude: 4" />
          <WaveRenderer sx={sx} data={waveC} width={512} height={128} title="C: frequency: 20, amplitude: 6" />
          <WaveRenderer sx={sx} data={waveABC} width={512} height={128} title="A + B + C" />
        </div>

        <hr />

        <h4>2. FFT Magnitude</h4>
        <div className="flex flex-wrap cg-20">
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveA))} width={512} height={128} title="magnitude of FFT(A)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveB))} width={512} height={128} title="magnitude of FFT(B)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveC))} width={512} height={128} title="magnitude of FFT(C)" />
          <WaveRenderer sx={sx} data={toMagnitude(transform(waveABC))} width={512} height={128} title="magnitude of FFT(A + B + C)" />
        </div>

        <hr />

        <h4>3. Filters and Reconstruct</h4>

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(lowPassFilter(transform(waveABC), SIMPLE_RATE, 10))}
            width={512}
            height={128}
            title="lowPassFilter(10)"
          />
          <WaveRenderer
            sx={sx}
            data={invTransform(lowPassFilter(transform(waveABC), SIMPLE_RATE, 10))}
            width={512}
            height={128}
            title="reconstruct(A)"
          />
        </div>

        <br />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(bandPassFilter(transform(waveABC), SIMPLE_RATE, 9, 11))}
            width={512}
            height={128}
            title="bandPassFilter(9, 11)"
          />
          <WaveRenderer
            sx={sx}
            data={invTransform(bandPassFilter(transform(waveABC), SIMPLE_RATE, 9, 11))}
            width={512}
            height={128}
            title="reconstruct(B)"
          />
        </div>

        <br />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer
            sx={sx}
            data={toMagnitude(hightPassFilter(transform(waveABC), SIMPLE_RATE, 18))}
            width={512}
            height={128}
            title="hightPassFilter(18)"
          />
          <WaveRenderer
            sx={sx}
            data={invTransform(hightPassFilter(transform(waveABC), SIMPLE_RATE, 18))}
            width={512}
            height={128}
            title="reconstruct(C)"
          />
        </div>
      </div>
    </div>
  );
};

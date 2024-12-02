import { WaveRenderer } from '@/components/wave-renderer';
import { magnitude2 } from '@/helpers/magnitude';
import FFT from 'fft.js';
import './index.css';
import { wave } from './wave';

const waveA = wave(6, 1, 512);
const waveB = wave(10, 4, 512);
const waveC = wave(20, 6, 512);
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

const bandFilter = (spectrum: number[], low: number, hight: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;

  for (let i = 0; i < length; ++i) {
    const positiveBand = low < i && i < hight;
    const negativeBand = length - hight < i && i < length - low;
    if (positiveBand || negativeBand) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

const lowPassFilter = (spectrum: number[], frequency: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;
  for (let i = 0; i < length; ++i) {
    if (i < frequency || i > length - frequency) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

const hightPassFilter = (spectrum: number[], frequency: number) => {
  const magnitude = toMagnitude(spectrum);
  const filtered: number[] = [];
  const length = magnitude.length;
  for (let i = 0; i < length; ++i) {
    if (frequency < i && i < length - frequency) filtered.push(spectrum[2 * i], spectrum[2 * i + 1]);
    else filtered.push(0, 0);
  }
  return filtered;
};

export const Wave = () => {
  return (
    <div className="wave">
      <div>
        <div className="flex flex-wrap cg-20">
          <WaveRenderer data={waveA} width={512} height={128} title="A: frequency: 6, amplitude: 1, bufferSize: 512" />
          <WaveRenderer data={waveB} width={512} height={128} title="B: frequency: 10, amplitude: 4, bufferSize: 512" />
          <WaveRenderer data={waveC} width={512} height={128} title="B: frequency: 20, amplitude: 6, bufferSize: 512" />
          <WaveRenderer data={waveABC} width={512} height={128} title="A + B + C" />
        </div>

        <hr />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer data={toMagnitude(transform(waveA))} width={512} height={128} title="magnitude of FFT(A)" />
          <WaveRenderer data={toMagnitude(transform(waveB))} width={512} height={128} title="magnitude of FFT(B)" />
          <WaveRenderer data={toMagnitude(transform(waveC))} width={512} height={128} title="magnitude of FFT(C)" />
          <WaveRenderer data={toMagnitude(transform(waveABC))} width={512} height={128} title="magnitude of FFT(A+B+C)" />
        </div>

        <hr />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer data={toMagnitude(hightPassFilter(transform(waveABC), 20))} width={512} height={128} title="hightPassFilter(20)" />
          <WaveRenderer
            data={invTransform(hightPassFilter(transform(waveABC), 20))}
            width={512}
            height={128}
            title="inverseTransform from filtered"
          />
        </div>

        <hr />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer data={toMagnitude(lowPassFilter(transform(waveABC), 10))} width={512} height={128} title="lowPassFilter(10)" />
          <WaveRenderer
            data={invTransform(lowPassFilter(transform(waveABC), 10))}
            width={512}
            height={128}
            title="inverseTransform from filtered"
          />
        </div>
        <hr />

        <div className="flex flex-wrap cg-20">
          <WaveRenderer data={toMagnitude(bandFilter(transform(waveABC), 10, 20))} width={512} height={128} title="bandFilter(8, 20)" />
          <WaveRenderer
            data={invTransform(bandFilter(transform(waveABC), 10, 20))}
            width={512}
            height={128}
            title="inverseTransform from filtered"
          />
        </div>
      </div>
    </div>
  );
};

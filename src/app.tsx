import FFT from 'fft.js';
import { useEffect, useState } from 'react';
import './app.css';
import { FileInput } from './components/file-input';
import { Mask } from './components/mask';
import { Renderer } from './components/renderer';
import { buildPixels, getChannels } from './helpers/get-channels';
import { fft2, ifft2 } from './fft2';
import { reshape, shift } from './helpers';
import { imageResize } from './helpers/image-resize';

export const App = () => {
  const [imageData, setImageData] = useState<ImageData>();
  const [spectrumData, setSpectrumData] = useState<ImageData>();
  const [mask, setMask] = useState<ImageData | undefined>();
  const [result, setResult] = useState<ImageData | undefined>();
  const [alpha, setAlpha] = useState<number[]>();
  const [spectrums, setSpectrums] = useState<number[][]>();

  const handleImageChange = (data: ImageData) => {
    const resizedImage = imageResize(data);
    setImageData(resizedImage);

    const [r, g, b, a] = getChannels(resizedImage);
    const { width, height } = resizedImage;

    const spectrum = [r, g, b].map((c) => shift(fft2(reshape(c, [width, height]))));
    const flatSpectrum = spectrum.map((x) => x.flat());
    const fft = new FFT(flatSpectrum[0].length / 2);
    const realFlatSpectrum = flatSpectrum.map((x) => fft.fromComplexArray(x));
    const spectrumPixels = buildPixels([...realFlatSpectrum, a]);
    const spectrumData = new ImageData(Uint8ClampedArray.from(spectrumPixels), width, height);

    setAlpha(a);
    setSpectrums(flatSpectrum);
    setSpectrumData(spectrumData);
  };

  useEffect(() => {
    if (!mask || !alpha || !spectrums) return;

    const { data, width, height } = mask;
    const maskedData: number[] = [];
    const rSpectrum: number[] = [];
    const gSpectrum: number[] = [];
    const bSpectrum: number[] = [];

    for (let i = 0; i < alpha.length; ++i) {
      const x = data[4 * i];
      const i2 = 2 * i;
      maskedData.push(spectrums[0][i2], spectrums[1][i2], spectrums[2][i2]);
      if (x < 125) {
        rSpectrum.push(0, 0);
        gSpectrum.push(0, 0);
        bSpectrum.push(0, 0);
        maskedData.push(0);
      } else {
        rSpectrum.push(spectrums[0][i2], spectrums[0][i2 + 1]);
        gSpectrum.push(spectrums[1][i2], spectrums[1][i2 + 1]);
        bSpectrum.push(spectrums[2][i2], spectrums[2][i2 + 1]);
        maskedData.push(alpha[i]);
      }
    }

    const maskedImage = new ImageData(Uint8ClampedArray.from(maskedData), width, height);
    setSpectrumData(maskedImage);

    const rChannel = ifft2(shift(reshape(rSpectrum, [width * 2, height])));
    const gChannel = ifft2(shift(reshape(gSpectrum, [width * 2, height])));
    const bChannel = ifft2(shift(reshape(bSpectrum, [width * 2, height])));

    const resultData = buildPixels([rChannel.flat(), gChannel.flat(), bChannel.flat(), alpha]);
    const resultImage = new ImageData(Uint8ClampedArray.from(resultData), width, height);
    setResult(resultImage);
  }, [alpha, spectrums, mask]);

  return (
    <div className="app">
      <div className="source-list">
        <FileInput onChange={handleImageChange} />
      </div>

      <div className="canvas-list">
        <Renderer className="canvas-box" data={imageData} title="Original" />
        <Renderer className="canvas-box" data={spectrumData} title="Spectrum" />
        <Mask className="canvas-box" data={imageData} onChange={setMask} />
        <Renderer className="canvas-box" data={result} title="Result" />
      </div>
    </div>
  );
};

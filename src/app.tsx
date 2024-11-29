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
  const [originalImage, setOriginalImage] = useState<ImageData>();
  const [spectrumImage, setSpectrumImage] = useState<ImageData>();
  const [maskImage, setMaskImage] = useState<ImageData | undefined>();
  const [resultImage, setResultImage] = useState<ImageData | undefined>();
  const [alpha, setAlpha] = useState<number[]>();
  const [spectrums, setSpectrums] = useState<number[][]>();

  const handleImageChange = (data: ImageData) => {
    const resizedImage = imageResize(data);
    setOriginalImage(resizedImage);

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
    setSpectrumImage(spectrumData);
  };

  useEffect(() => {
    if (!maskImage || !alpha || !spectrums) return;

    const { data, width, height } = maskImage;
    const maskedData: number[] = [];
    const rSpectrum: number[] = [];
    const gSpectrum: number[] = [];
    const bSpectrum: number[] = [];

    for (let i = 0; i < alpha.length; ++i) {
      const x = data[4 * i] / 255;
      const i2 = 2 * i;
      const r = spectrums[0][i2];
      const g = spectrums[1][i2];
      const b = spectrums[2][i2];
      maskedData.push(r * x, g * x, b * x, alpha[i]);
      rSpectrum.push(r * x, spectrums[0][i2 + 1] * x);
      gSpectrum.push(g * x, spectrums[1][i2 + 1] * x);
      bSpectrum.push(b * x, spectrums[2][i2 + 1] * x);
    }

    const maskedImage = new ImageData(Uint8ClampedArray.from(maskedData), width, height);
    setSpectrumImage(maskedImage);

    const rChannel = ifft2(shift(reshape(rSpectrum, [width * 2, height])));
    const gChannel = ifft2(shift(reshape(gSpectrum, [width * 2, height])));
    const bChannel = ifft2(shift(reshape(bSpectrum, [width * 2, height])));

    const resultData = buildPixels([rChannel.flat(), gChannel.flat(), bChannel.flat(), alpha]);
    const resultImage = new ImageData(Uint8ClampedArray.from(resultData), width, height);
    setResultImage(resultImage);
  }, [alpha, spectrums, maskImage]);

  return (
    <div className="app">
      <div className="source-list">
        <FileInput onChange={handleImageChange} />
      </div>

      <div className="canvas-list">
        <Renderer className="canvas-box" data={originalImage} title="Original" />
        <Renderer className="canvas-box" data={spectrumImage} title="Spectrum" />
        <Mask className="canvas-box" data={originalImage} onChange={setMaskImage} />
        <Renderer className="canvas-box" data={resultImage} title="Result" />
      </div>
    </div>
  );
};

import FFT from 'fft.js';
import { useState } from 'react';
import './app.css';
import { FileInput } from './components/file-input';
import { Mask } from './components/mask';
import { Masked } from './components/masked';
import { Original } from './components/original';
import { Spectrum } from './components/spectrum';
import { buildPixels, getChannels } from './components/spectrum/get-channels';
import { fft2 } from './fft2';
import { reshape } from './helpers';
import { imageResize } from './helpers/image-resize';
import { Result } from './components/result';

export const App = () => {
  const [imageData, setImageData] = useState<ImageData>();
  const [spectrumData, setSpectrumData] = useState<ImageData>();
  const [masked, setMasked] = useState<ImageData | undefined>();
  const [result, setResult] = useState<ImageData | undefined>();

  const handleImageChange = (data: ImageData) => {
    const resizedImage = imageResize(data);
    setImageData(resizedImage);

    const [r, g, b, a] = getChannels(resizedImage);
    const { width, height } = resizedImage;

    const spectrum = [r, g, b].map((c) => fft2(reshape(c, [width, height])));
    const flatSpectrum = spectrum.map((x) => x.flat());
    const fft = new FFT(flatSpectrum[0].length / 2);
    const realFlatSpectrum = flatSpectrum.map((x) => fft.fromComplexArray(x));
    const spectrumPixels = buildPixels([...realFlatSpectrum, a]);

    const spectrumData = new ImageData(Uint8ClampedArray.from(spectrumPixels), width, height);
    setSpectrumData(spectrumData);
    setMasked(spectrumData);
  };

  const handleMaskChange = (mask: ImageData) => {
    if (!imageData || !spectrumData) return;
    const maskedData = new ImageData(Uint8ClampedArray.from(spectrumData.data), spectrumData.width, spectrumData.height);
    const maskData = mask.data;
    for (let i = 0; i < maskData.length; i += 4) {
      const x = maskData[i];
      if (x === 0) maskedData.data[i + 3] = 0;
    }

    setMasked(maskedData);
  };

  return (
    <div className="app">
      <div className="source-list">
        <FileInput onChange={handleImageChange} />
      </div>

      <div className="canvas-list">
        <Original className="canvas-box" data={imageData} />
        <Spectrum className="canvas-box" data={spectrumData} />
        <Mask className="canvas-box" data={imageData} onChange={handleMaskChange} />
        <Masked className="canvas-box" data={masked} />
        <Result className="canvas-box" data={result} />
      </div>
    </div>
  );
};

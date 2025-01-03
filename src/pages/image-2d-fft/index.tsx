import { FileInput } from '@/components/file-input';
import { Mask } from '@/components/mask';
import { Renderer } from '@/components/renderer';
import { fft2, ifft2 } from '@/fft2';
import { reshape, shift } from '@/helpers';
import { centering } from '@/helpers/centering';
import { buildPixels, getChannels } from '@/helpers/get-channels';
import { magnitude } from '@/helpers/magnitude';
import { useCallback, useEffect, useState } from 'react';
import './index.css';

export const Image2DFFT = () => {
  const [originalImage, setOriginalImage] = useState<ImageData>();
  const [spectrumImage, setSpectrumImage] = useState<ImageData>();
  const [maskImage, setMaskImage] = useState<ImageData | undefined>();
  const [resultImage, setResultImage] = useState<ImageData | undefined>();
  const [alpha, setAlpha] = useState<number[]>();
  const [spectrums, setSpectrums] = useState<number[][]>();

  const handleImageChange = useCallback((data: ImageData) => {
    const centeredImage = centering(data);
    setOriginalImage(centeredImage);

    const [r, g, b, a] = getChannels(centeredImage);
    const { width, height } = centeredImage;

    const spectrum = [r, g, b].map((c) => shift(fft2(reshape(c, [width, height]))));
    const flatSpectrum = spectrum.map((x) => x.flat());

    setAlpha(a);
    setSpectrums(flatSpectrum);
  }, []);

  useEffect(() => {
    if (!maskImage || !alpha || !spectrums) return;

    const { data, width, height } = maskImage;
    const maskedData: number[] = [];
    const rSpectrum: number[] = [];
    const gSpectrum: number[] = [];
    const bSpectrum: number[] = [];

    for (let i = 0; i < alpha.length; ++i) {
      const x = data[4 * i] / 255;
      const even = 2 * i;
      const odd = even + 1;
      const reR = spectrums[0][even] * x;
      const reG = spectrums[1][even] * x;
      const reB = spectrums[2][even] * x;
      const imR = spectrums[0][odd] * x;
      const imG = spectrums[1][odd] * x;
      const imB = spectrums[2][odd] * x;

      const r = magnitude(reR, imR),
        g = magnitude(reG, imG),
        b = magnitude(reB, imB);
      maskedData.push(r, g, b, alpha[i]);

      rSpectrum.push(reR, imR);
      gSpectrum.push(reG, imG);
      bSpectrum.push(reB, imB);
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
      <div>
        <h2>Image 2D FFT</h2>
        <p>select or update a image file to do FFT. Draw on mask to filter spectrum. (white pass, black filter)</p>
        <ul>
          <li>
            press <kbd>x</kbd> switch brush color
          </li>
          <li>
            press <kbd>ctrl-i</kbd> invert mask color
          </li>
          <li>
            press <kbd>[</kbd> <kbd>]</kbd> or scroll wheel to zoom brush size
          </li>
        </ul>
      </div>

      <div className="content">
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
    </div>
  );
};

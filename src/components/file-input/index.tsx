import { useEffect, type FC } from 'react';
import './index.css';
import { readImage } from './read-image';
import { loadImage } from '@/helpers/load-image';

const modules = import.meta.glob<{ default: string }>('/src/assets/*.{jpg,png}', { eager: true });
const images = Object.values(modules);
const defaultImage = images[0].default;

export type FileInputProps = {
  onChange?: (imageData: ImageData) => void;
};

export const FileInput: FC<FileInputProps> = (props) => {
  const { onChange } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.src = src;
      img.onload = () => onChange?.(readImage(img));
    };
    reader.readAsDataURL(file);
  };
  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLImageElement;
    const clone = target.cloneNode() as HTMLImageElement;
    onChange?.(readImage(clone));
  };

  useEffect(() => {
    loadImage(defaultImage).then((img) => onChange?.(readImage(img)));
  }, [onChange]);

  return (
    <div className="file-input">
      <div className="input-box">
        <input type="file" id="input" accept="image/png, image/jpeg, image/jpg, image/bmp" onChange={handleChange} />
      </div>

      <div className="gallery">
        {images.map((x) => (
          <img key={x.default} src={x.default} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

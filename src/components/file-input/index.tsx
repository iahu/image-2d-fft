import type { FC } from 'react';
import './index.css';
import { readImage } from './read-image';

const modules = import.meta.glob<{ default: string }>('/src/assets/*.jpg', { eager: true });
const images = Object.values(modules);

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
      onChange?.(readImage(img));
    };
    reader.readAsDataURL(file);
  };
  const handleClick = (event: React.MouseEvent) => {
    onChange?.(readImage(event.target as HTMLImageElement));
  };

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
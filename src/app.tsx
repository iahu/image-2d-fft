import { Route, Routes } from 'react-router';
import './app.css';
import { Image2DFFT } from './pages/image-2d-fft';
import { Wave } from './pages/wave';
import { IndexPage } from './pages';

export const App = () => {
  return (
    <Routes>
      <Route path="/" index element={<IndexPage />} />
      <Route path="/image" element={<Image2DFFT />} />
      <Route path="/wave" element={<Wave />} />
    </Routes>
  );
};

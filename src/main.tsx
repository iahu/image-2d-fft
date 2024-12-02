import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './app';

createRoot(document.querySelector('#root')!).render(
  <BrowserRouter basename="image-2d-fft">
    <App />
  </BrowserRouter>,
);

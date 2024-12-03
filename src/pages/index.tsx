import { Link } from 'react-router';

export const IndexPage = () => {
  return (
    <div className="index-page p-20">
      <h1>FFT online demo</h1>
      <ul>
        <li>
          <Link to="/wave">periodic wave fft</Link>
        </li>
        <li>
          <Link to="/image">image 2d fft</Link>
        </li>
      </ul>

      <a href="https://github.com/iahu/image-2d-fft">github repository</a>
    </div>
  );
};

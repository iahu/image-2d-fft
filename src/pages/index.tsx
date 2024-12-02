import { Link } from 'react-router';

export const IndexPage = () => {
  return (
    <div className="index-page">
      <ul>
        <li>
          <Link to="/image-2d-fft">image-2d-fft</Link>
        </li>
        <li>
          <Link to="/wave">wave</Link>
        </li>
      </ul>
    </div>
  );
};

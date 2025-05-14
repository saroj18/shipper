import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 24 24" className="h-10 w-10">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="url(#mern-gradient)"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M2 17L12 22L22 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M2 12L12 17L22 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient
              id="mern-gradient"
              x1="2"
              y1="7"
              x2="22"
              y2="7"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#00ED64" />
              <stop offset="0.5" stopColor="#61DAFB" />
              <stop offset="1" stopColor="#339933" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="font-bold text-2xl">Shipper</span>
    </Link>
  );
}

export default Logo

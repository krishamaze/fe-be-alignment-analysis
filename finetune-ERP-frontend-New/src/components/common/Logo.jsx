import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold text-[#444444]">fine</span>
      <span className="text-2xl font-bold text-[#e1c236] ml-[-2px]">tune</span>
      <span className="text-sm text-gray-500 ml-[-1px]">.store</span>
    </Link>
  );
}

export default Logo;

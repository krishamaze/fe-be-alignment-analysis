import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-heading-lg font-bold text-primary/70 dark:text-surface/70">fine</span>
      <span className="text-heading-lg font-bold text-secondary ml-[-2px]">tune</span>
      <span className="text-body-sm text-primary/50 dark:text-surface/50 ml-[-1px]">.store</span>
    </Link>
  );
}

export default Logo;

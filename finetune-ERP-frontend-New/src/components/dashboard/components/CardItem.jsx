import { Link } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { toast } from 'react-toastify';

function CardItem({ title = 'Feature', icon, disabled = false, to }) {
  const content = (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={disabled ? () => toast.info('Coming soon') : undefined}
      onKeyDown={disabled ? (e) => { if (e.key === 'Enter') toast.info('Coming soon'); } : undefined}
      className={`rounded-2xl p-4 shadow-sm flex items-center justify-between bg-surface dark:bg-primary transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-keyline ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
    >
      <h3 className="text-body-lg font-semibold text-primary dark:text-surface">{title}</h3>
      <div className="text-primary/40 dark:text-surface/40">
        {icon || <HiOutlineLockClosed size={28} />}
      </div>
    </div>
  );

  if (!disabled && to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

export default CardItem;

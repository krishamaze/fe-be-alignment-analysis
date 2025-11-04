import { useEffect } from 'react';

const HINT_MESSAGES = {
  vertical: '↑ Swipe up / down ↓',
  horizontal: '← Swipe for more →',
};

export default function SwipeHint({ show, mode = 'horizontal', onDismiss }) {
  useEffect(() => {
    if (!show) return undefined;

    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) return null;

  const message = HINT_MESSAGES[mode] ?? HINT_MESSAGES.horizontal;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium animate-pulse">
      {message}
    </div>
  );
}

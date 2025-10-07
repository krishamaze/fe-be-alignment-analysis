import loader from '@/assets/images/loader.gif';

/**
 * Loader component displays a centered loading spinner with animation.
 *
 * @component
 * @description Renders a full-screen overlay with a loading GIF and text.
 * Used throughout the application to indicate async operations in progress.
 * Supports dark mode with theme-aware background and text colors.
 *
 * @returns {JSX.Element} A centered loading indicator overlay
 *
 * @example
 * // Display loader during data fetching
 * {isLoading && <Loader />}
 */
export default function Loader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/60 dark:bg-primary/60">
      <div className="text-center">
        <img src={loader} alt="loading..." className="w-20 h-20" />
        <h2 className="mt-2 text-primary dark:text-surface">Loading...</h2>
      </div>
    </div>
  );
}

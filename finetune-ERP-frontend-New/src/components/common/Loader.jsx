import loader from '@/assets/images/loader.gif';

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

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-surface mt-auto text-center py-6 border-t border-keyline/20">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-2 px-4">
        <Logo />
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Finetune</p>
      </div>
    </footer>
  );
}

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-surface mt-auto text-center py-6 border-t border-keyline/20">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-2 px-4">
        <Logo />
        <address className="not-italic text-sm text-gray-500 text-center">
          Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu, near KK MAHAAL,
          Coimbatore, Tamil Nadu 641105. Phone:{' '}
          <a href="tel:+919791151863" className="text-keyline">
            +91 97911 51863
          </a>
        </address>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Finetune
        </p>
      </div>
    </footer>
  );
}

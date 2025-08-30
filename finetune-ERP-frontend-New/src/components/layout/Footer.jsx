import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hidden md:flex fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white text-gray-500 text-xs h-10 items-center justify-center z-40">
      <div className="flex items-center gap-2">
        <span>© {year} Finetune.Store</span>
        <span>|</span>
        <Link
          to="/privacy"
          className="hover:underline hover:opacity-80 transition-opacity"
        >
          Privacy
        </Link>
        <span>|</span>
        <Link
          to="/terms"
          className="hover:underline hover:opacity-80 transition-opacity"
        >
          Terms
        </Link>
        <span>|</span>
        <Link
          to="/sitemap"
          className="hover:underline hover:opacity-80 transition-opacity"
        >
          Sitemap
        </Link>
        <span>|</span>
        <Link
          to="https://instagram.com"
          aria-label="Instagram"
          className="p-1 border border-gray-400 rounded-full hover:text-secondary hover:border-secondary transition-colors"
        >
          <Instagram className="w-4 h-4" />
        </Link>
        <span>|</span>
        <Link
          to="https://wa.me/"
          aria-label="WhatsApp"
          className="p-1 border border-gray-400 rounded-full hover:text-secondary hover:border-secondary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </Link>
      </div>
    </footer>
  );
}

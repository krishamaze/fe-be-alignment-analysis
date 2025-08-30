import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block mt-16">
      <div className="border-t border-gray-200">
        <div className="max-w-screen-lg mx-auto flex items-center justify-center gap-4 text-sm text-gray-500 py-2">
          <span>© {new Date().getFullYear()} Finetune.Store</span>
          <Link
            to="/privacy"
            className="hover:underline hover:text-secondary transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="hover:underline hover:text-secondary transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/sitemap"
            className="hover:underline hover:text-secondary transition-colors"
          >
            Sitemap
          </Link>
          <Link
            to="https://instagram.com"
            className="hover:text-secondary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </Link>
          <Link
            to="https://wa.me/"
            className="hover:text-secondary transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-white text-gray-500 text-sm mt-16">
      <div className="border-t border-gray-200">
        <div className="max-w-screen-lg mx-auto flex items-center justify-center gap-6 py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              to="https://instagram.com"
              className="hover:text-secondary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              to="https://wa.me/"
              className="hover:text-secondary transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center gap-2 py-4">
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline hover:opacity-80">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline hover:opacity-80">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:underline hover:opacity-80">
              Sitemap
            </Link>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} Finetune.Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

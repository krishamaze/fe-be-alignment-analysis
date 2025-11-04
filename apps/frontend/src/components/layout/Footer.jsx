import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer({ isVisible = false }) {
  return (
    <footer
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white/95 backdrop-blur-sm border-t border-gray-200
        transition-transform duration-300 ease-in-out
        hidden md:block
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Brand + Links */}
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-gray-700 transition-colors"
            >
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gray-700 transition-colors">
              Terms
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-gray-700 transition-colors"
            >
              Sitemap
            </Link>
            <span>© 2025 Finetune Store</span>
          </div>
        </div>

        {/* Right: Social Media */}
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-secondary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-secondary transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

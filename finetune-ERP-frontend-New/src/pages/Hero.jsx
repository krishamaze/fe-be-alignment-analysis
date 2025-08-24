import { Link } from 'react-router-dom';
import logo from '/src/assets/logo.png';

function Hero() {
  return (
    <section
      id="hero"
      className="h-screen bg-gradient-to-r from-primary/70 to-secondary flex flex-col-reverse md:flex-row items-center justify-center px-6 py-12 pt-4 sm:pt-6 md:pt-10 snap-start"
    >
      {/* Left Section */}
      <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center">
        <h1 className="text-display-md md:text-display-lg font-extrabold text-surface leading-tight max-w-xl mx-auto md:mx-0">
          Don't just repair —<br />
          We <span className="text-secondary">finetune</span> it.
        </h1>
        <p className="mt-4 text-body-lg text-surface max-w-md mx-auto md:mx-0">
          Expert mobile & gadget repair, trusted by thousands. Visit us or book
          online in seconds.
        </p>
        <div className="mt-6 w-full flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <a
            href="https://wa.me/919994422442"
            className="bg-success text-surface px-6 py-3 rounded-lg hover:bg-success/80 transition"
          >
            Book via WhatsApp
          </a>
          <a
            href="#services"
            className="bg-surface text-primary px-6 py-3 rounded-lg border hover:bg-surface/80 transition dark:bg-primary dark:text-surface dark:border-surface/30 dark:hover:bg-primary/80"
          >
            View Services
          </a>
          <Link
            to="/schedule-call"
            className="bg-primary text-surface px-6 py-3 rounded-lg hover:bg-primary/80 transition dark:bg-surface dark:text-primary dark:hover:bg-surface/80"
          >
            Schedule a Call
          </Link>
        </div>
      </div>

      {/* Right Section - Hero Image */}
      <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
        <img
          src={logo}
          alt="Phone Repair"
          className="w-80 md:w-96 drop-shadow-2xl"
        />
      </div>
    </section>
  );
}

export default Hero;

  import { Link } from 'react-router-dom';
  import logo from '/src/assets/logo.png';

  function Hero() {
    return (
      <section 
        id="hero" 
        className="h-screen bg-gradient-to-r from-[#444444] to-[#e2c33d] flex flex-col-reverse md:flex-row items-center justify-center px-6 py-12 pt-4 sm:pt-6 md:pt-10 snap-start"
      >
        {/* Left Section */}
        <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-xl mx-auto md:mx-0">
            Don't just repair —<br />We <span className="text-[#e2c33d]">finetune</span> it.
          </h1>
          <p className="mt-4 text-lg text-white max-w-md mx-auto md:mx-0">
            Expert mobile & gadget repair, trusted by thousands. Visit us or book online in seconds.
          </p>
          <div className="mt-6 w-full flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <a
              href="https://wa.me/919994422442"
              className="bg-[#128C7E] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Book via WhatsApp
            </a>
            <a
              href="#services"
              className="bg-white text-black px-6 py-3 rounded-lg border hover:bg-gray-100 transition"
            >
              View Services
            </a>
            <Link
              to="/schedule-call"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
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
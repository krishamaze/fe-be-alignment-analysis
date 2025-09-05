import { Link } from 'react-router-dom';
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineBattery100,
  HiOutlineBolt,
} from 'react-icons/hi2';

export default function QuickActions() {
  const repairs = [
    {
      icon: HiOutlineDevicePhoneMobile,
      title: 'Screen Repair',
      price: 'from ₹800',
      description: 'Cracked or damaged display',
      link: '/repair?service=screen',
      color: 'text-blue-500',
    },
    {
      icon: HiOutlineBattery100,
      title: 'Battery Replacement',
      price: 'from ₹600',
      description: 'Fast draining or dead battery',
      link: '/repair?service=battery',
      color: 'text-green-500',
    },
    {
      icon: HiOutlineBolt,
      title: 'Charging Port Fix',
      price: 'from ₹500',
      description: 'Loose or faulty charging port',
      link: '/repair?service=charging',
      color: 'text-yellow-500',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Most Popular Repairs
          </h2>
          <p className="text-lg text-gray-600">
            Transparent pricing • Same-day service • 90-day warranty
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {repairs.map(({ icon, title, price, description, link, color }) => {
            const Icon = icon;
            return (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <Icon
                  className={`w-12 h-12 ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-3xl font-bold mb-2">{price}</p>
                <p className="text-gray-600 mb-6">{description}</p>
                <Link
                  to={link}
                  className="min-h-[44px] inline-flex items-center justify-center px-5 py-2 rounded-lg bg-gray-900 text-white font-medium group-hover:bg-yellow-400 group-hover:text-gray-900 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/repair"
            className="text-gray-900 hover:text-yellow-600 font-medium"
          >
            View all repair services →
          </Link>
        </div>
      </div>
    </section>
  );
}

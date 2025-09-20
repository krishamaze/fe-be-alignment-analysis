import { Link } from 'react-router-dom';
import MultiSlideReel from '@/components/layout/MultiSlideReel';
import { Smartphone, Battery, PlugZap } from 'lucide-react';

export default function QuickActionsReel() {
  const repairs = [
    {
      icon: Smartphone,
      title: 'Screen Repair',
      price: 'from ₹800',
      description: 'Cracked or damaged display',
      link: '/repair?service=screen',
      color: 'text-secondary',
    },
    {
      icon: Battery,
      title: 'Battery Replacement',
      price: 'from ₹600',
      description: 'Fast draining or dead battery',
      link: '/repair?service=battery',
      color: 'text-success',
    },
    {
      icon: PlugZap,
      title: 'Charging Port Fix',
      price: 'from ₹500',
      description: 'Loose or faulty charging port',
      link: '/repair?service=charging',
      color: 'text-secondary',
    },
  ];
  const slides = [
    <div key="repairs" className="h-full flex">
      <div className="max-w-5xl mx-auto w-full h-full px-4 flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-heading-xl font-bold text-primary">
            Most Popular Repairs
          </h2>
          <p className="text-body-lg text-primary/60">
            Transparent pricing • Same-day service • 90-day warranty
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 place-items-stretch">
          {repairs.map(({ icon, title, price, description, link, color }) => {
            const Icon = icon;
            return (
              <div
                key={title}
                className="bg-surface shadow-sm hover:shadow-lg transition-transform duration-300 rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 space-y-3"
              >
                <Icon className={`w-12 h-12 ${color}`} />
                <h3 className="text-heading-md font-semibold text-primary">
                  {title}
                </h3>
                <p className="text-display-md font-bold text-primary">
                  {price}
                </p>
                <p className="text-body-md text-primary/60">{description}</p>
                <Link
                  to={link}
                  className="min-h-[44px] inline-flex items-center justify-center px-5 py-2 rounded-lg bg-primary text-surface font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Book Now
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/repair"
            className="text-primary hover:text-secondary font-medium text-body-lg"
          >
            View all repair services →
          </Link>
        </div>
      </div>
    </div>,
  ];

  return (
    <section className="snap-start fullpage-section overflow-hidden bg-gradient-to-b from-secondary/40 to-surface">
      <MultiSlideReel reelId="quickActions" showHint={false} mode="vertical">
        {slides}
      </MultiSlideReel>
    </section>
  );
}

import { Link } from 'react-router-dom';
import SectionSlider from '@/components/navigation/SectionSlider';
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

  return (
    <section className="snap-start fullpage-section overflow-hidden bg-gradient-to-b from-secondary/40 to-surface">
      <SectionSlider sectionId="quickActions" showHint={false} mode="vertical">
        <div key="repairs" className="flex h-full">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-8 px-4">
            <div className="text-center space-y-2">
              <h2 className="text-heading-xl font-bold text-primary">
                Most Popular Repairs
              </h2>
              <p className="text-body-lg text-primary/60">
                Transparent pricing • Same-day service • 90-day warranty
              </p>
            </div>

            <div className="w-full">
              <SectionSlider
                reelId="quickActions-cards"
                showHint={false}
                mode="horizontal"
                className="mt-6"
                style={{ '--reel-section-min-h': 'auto' }}
                slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                autoAdvanceGroup
              >
                {repairs.map(
                  ({ icon, title, price, description, link, color }) => {
                    const Icon = icon;
                    return (
                      <div
                        key={title}
                        className="flex h-full items-stretch px-2"
                        aria-label={`${title} repair option`}
                      >
                        <article className="flex w-full flex-col items-center justify-between space-y-4 rounded-2xl bg-surface p-6 text-center shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                          <Icon className={`h-12 w-12 ${color}`} />
                          <div className="space-y-3">
                            <h3 className="text-heading-md font-semibold text-primary">
                              {title}
                            </h3>
                            <p className="text-display-md font-bold text-primary">
                              {price}
                            </p>
                            <p className="text-body-md text-primary/60">
                              {description}
                            </p>
                          </div>
                          <Link
                            to={link}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 py-2 font-medium text-surface transition-colors hover:bg-secondary hover:text-primary"
                          >
                            Book Now
                          </Link>
                        </article>
                      </div>
                    );
                  }
                )}
              </SectionSlider>
            </div>

            <div className="text-center">
              <Link
                to="/repair"
                className="text-body-lg font-medium text-primary hover:text-secondary"
              >
                View all repair services →
              </Link>
            </div>
          </div>
        </div>
      </SectionSlider>
    </section>
  );
}

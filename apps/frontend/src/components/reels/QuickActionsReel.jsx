import SectionSlider from '@/components/navigation/SectionSlider';
import { Smartphone, Battery, PlugZap } from 'lucide-react';
import Button from '@/components/common/Button';

/**
 * Quick Actions Section Component
 * 
 * Displays popular repair services in a horizontal scrolling carousel.
 * Shows 1 slide on mobile, 2 on tablet, 3 on desktop.
 * 
 * Features:
 * - Service cards with pricing
 * - Direct booking links with service context
 * - Icon-based visual representation
 * 
 * @component
 * @returns {React.Element} Quick actions carousel section
 */
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

  const slides = repairs.map(
    ({ icon, title, price, description, link, color }) => {
      const Icon = icon;
      return (
        <div
          key={title}
          className="flex h-full items-stretch px-2"
          aria-label={`${title} repair option`}
        >
          <article 
            className="flex w-full flex-col items-center justify-between space-y-4 rounded-2xl bg-surface p-6 text-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2"
            tabIndex="0"
          >
            <Icon className={`h-12 w-12 ${color}`} aria-hidden="true" />
            <div className="space-y-3">
              <h3 className="text-heading-md font-semibold text-primary">
                {title}
              </h3>
              <p className="text-display-md font-bold text-primary">{price}</p>
              <p className="text-body-md text-primary/60">{description}</p>
            </div>
            <Button to={link} variant="primary" size="md">
              Book Now
            </Button>
          </article>
        </div>
      );
    }
  );

  return (
    <section className="snap-start fullpage-section overflow-hidden bg-gradient-to-b from-secondary/40 to-surface">
      <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-heading-xl font-bold text-primary">
            Most Popular Repairs
          </h2>
          <p className="text-body-lg text-primary/60">
            Transparent pricing • Same-day service • 90-day warranty
          </p>
        </div>

        <SectionSlider
          sectionId="quickActions"
          showHint
          mode="horizontal"
          className="w-full flex-1"
          slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        >
          {slides}
        </SectionSlider>
      </div>
    </section>
  );
}

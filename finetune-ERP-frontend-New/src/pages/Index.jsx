import PageWrapper from '@/components/layout/PageWrapper';
import HeroReel from '@/components/reels/HeroReel';
import QuickActionsReel from '@/components/reels/QuickActionsReel';
import TestimonialsReel from '@/components/reels/TestimonialsReel';

export default function Index() {
  return (
    <>
      <title>Home – Finetune</title>
      <meta
        name="description"
        content="Expert Mobile & Laptop Repairs in Coimbatore & Palakkad"
      />
      <PageWrapper mode="reel">
        <div
          className="h-full overflow-y-auto"
          style={{
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          <HeroReel />
          <QuickActionsReel />
          <TestimonialsReel />
        </div>
      </PageWrapper>
    </>
  );
}

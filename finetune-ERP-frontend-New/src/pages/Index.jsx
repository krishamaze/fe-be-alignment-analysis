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
      <PageWrapper mode="scroll">
        <div className="snap-y snap-mandatory overflow-y-auto h-screen">
          <HeroReel />
          <QuickActionsReel />
          <TestimonialsReel />
        </div>
      </PageWrapper>
    </>
  );
}

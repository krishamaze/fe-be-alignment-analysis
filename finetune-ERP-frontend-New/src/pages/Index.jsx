import HeroSection from '@/components/home/HeroSection';
import QuickActions from '@/components/home/QuickActions';
import CustomerTestimonials from '@/components/home/CustomerTestimonials';
import ReelLayout from '@/components/layout/ReelLayout';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Index() {
  return (
    <>
      <title>Home – Finetune</title>
      <meta
        name="description"
        content="Expert Mobile & Laptop Repairs in Coimbatore & Palakkad"
      />
      <meta property="og:title" content="Home – Finetune" />
      <meta
        property="og:description"
        content="Expert Mobile & Laptop Repairs in Coimbatore & Palakkad"
      />
      <PageWrapper mode="reel">
        <ReelLayout autoplay>
          <HeroSection />
          <QuickActions />
          <CustomerTestimonials />
        </ReelLayout>
      </PageWrapper>
    </>
  );
}

import HeroSection from '@/components/home/HeroSection';
import QuickActions from '@/components/home/QuickActions';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Index() {
  return (
    <>
      <title>Home – Finetune</title>
      <meta name="description" content="We finetune your device." />
      <meta property="og:title" content="Home – Finetune" />
      <meta property="og:description" content="We finetune your device." />
      <PageWrapper mode="reel">
        <HeroSection />
        <QuickActions />
      </PageWrapper>
    </>
  );
}

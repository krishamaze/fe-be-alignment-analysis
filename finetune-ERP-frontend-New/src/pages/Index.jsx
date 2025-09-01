import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/home/HeroSection';

export default function Index() {
  return (
    <PublicLayout>
      <title>Home – Finetune</title>
      <meta name="description" content="We finetune your device." />
      <meta property="og:title" content="Home – Finetune" />
      <meta property="og:description" content="We finetune your device." />
      <HeroSection />
    </PublicLayout>
  );
}

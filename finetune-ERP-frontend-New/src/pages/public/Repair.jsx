import { useEffect } from 'react';
import { useScrollMode } from '@/components/layout/ScrollModeContext';

export default function Repair() {
  const { setMode } = useScrollMode();

  useEffect(() => {
    setMode('scroll');
  }, [setMode]);

  return (
    <>
      <title>Repair – Finetune</title>
      <meta name="description" content="Online repair bookings coming soon." />
      <div className="p-4">Online repair bookings coming soon.</div>
    </>
  );
}

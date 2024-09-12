'use client';

import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import MissionVisionSection from '@/components/home/MissionVisionSection';
import ServicesSection from '@/components/home/ServicesSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MissionVisionSection />
      <HowItWorksSection />
      <ServicesSection />
    </div>
  );
}

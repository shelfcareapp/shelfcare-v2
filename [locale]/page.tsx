'use client';

import HeroSection from 'components/home/HeroSection';
import HowItWorksSection from 'components/home/HowItWorksSection';
import MissionVisionSection from 'components/home/MissionVisionSection';
import ServicesSection from 'components/home/ServicesSection';
import Layout from 'components/common/Layout';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <MissionVisionSection />
      <HowItWorksSection />
      <ServicesSection />
    </Layout>
  );
}

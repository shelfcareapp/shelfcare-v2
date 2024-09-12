'use client';

import Image from 'next/image';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';
import image1 from '../../../public/images/DDD71F8C-2ED9-4161-8263-19DC5B1FABE4.JPG';
import image2 from '../../../public/images/736C8CA9-7086-4A5B-A6C4-DA4771CC780A.JPG';

const MissionVisionSection = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'mission-vision');

  return (
    <section className="py-32 px-6 md:px-8 bg-primary text-secondary relative">
      <div className="">
        {/* <h2 className="text-5xl font-bold  mb-16 text-center">
          {t.title || 'Our Mission & Vision'}
        </h2> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {/* Mission Section */}
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-semibold mb-4">
              {t.missionTitle || 'Our Mission'}
            </h3>
            <p className="text-base text-secondary opacity-70">
              {t.mission ||
                'Our mission is to make repair and maintenance services for clothing, shoes and accessories more accessible, and establish these services as a regular activity for wardrobe care and sustainable fashion consumption.'}
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary opacity-20 rounded-lg transform -rotate-12"></div>
            <Image
              src={image1}
              alt="Mission Image"
              width={300}
              height={100}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          {/* Vision Section */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary opacity-20 rounded-lg transform rotate-12"></div>
            <Image
              src={image2}
              alt="Vision Image"
              width={300}
              height={100}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-semibold mb-4">
              {t.visionTitle || 'Our Vision'}
            </h3>
            <p className="text-secondary opacity-70">
              {t.vision ||
                'ShelfCare stands for the new age of fashion industry where quality cancels out quantity. Instead of following the trends and continuous consumption, the focus is on personal style, perfectly fitting and beloved clothes which their owners want to take care of.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;

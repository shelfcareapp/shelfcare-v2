'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import image1 from '../../../public/images/DDD71F8C-2ED9-4161-8263-19DC5B1FABE4.JPG';
import image2 from '../../../public/images/736C8CA9-7086-4A5B-A6C4-DA4771CC780A.JPG';

const MissionVisionSection = () => {
  const t = useTranslations();

  return (
    <section className="py-12 md:py-32 px-6 md:px-8 bg-primary text-secondary relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Mission Section */}
        <div className="flex flex-col items-start order-1 md:order-1">
          <h3 className="text-2xl font-semibold mb-4">
            {t('home.mission-vision.missionTitle')}
          </h3>
          <p className="text-sm text-secondary opacity-70">
            {t('home.mission-vision.mission')}
          </p>
        </div>

        {/* Mission Image */}
        <div className="relative order-2 md:order-2">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary opacity-20 rounded-lg transform -rotate-12"></div>
          <Image
            src={image1}
            alt="Mission Image"
            width={300}
            height={100}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Vision Image */}
        <div className="relative order-4 md:order-3">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary opacity-20 rounded-lg transform rotate-12"></div>
          <Image
            src={image2}
            alt="Vision Image"
            width={300}
            height={100}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Vision Section */}
        <div className="flex flex-col items-start order-3 md:order-4">
          <h3 className="text-2xl font-semibold mb-4">
            {t('home.mission-vision.visionTitle')}
          </h3>
          <p className="text-secondary text-sm opacity-70">
            {t('home.mission-vision.vision')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;

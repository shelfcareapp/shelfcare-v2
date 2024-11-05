'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import tailoringImage from 'public/images/tailoring.png';
import laundryImage from 'public/images/laundry.png';
import cobblerImage from 'public/images/cobbler.png';

const services = [
  {
    key: 'tailoring',
    image: tailoringImage
  },
  {
    key: 'cobbler',
    image: cobblerImage
  },
  {
    key: 'laundry',
    image: laundryImage
  }
];

const ServicesSection = () => {
  const t = useTranslations();

  return (
    <section className="py-16 px-6 md:px-24 bg-primary text-secondary">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold mb-8">
            {t('home.services.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 flex flex-col"
            >
              <Image
                src={service.image}
                alt={t(`home.services.${service.key}.title`)}
                width={400}
                height={480}
                className="object-cover w-full h-96"
              />

              <div className="absolute inset-0 p-4 bg-gradient-to-t from-black/100 via-black/80 to-transparent top-[55%]">
                <h3 className="text-2xl font-semibold text-white">
                  {t(`home.services.${service.key}.title`)}
                </h3>
                <p className="text-white opacity-80 mt-2">
                  {t(`home.services.${service.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

'use client';

import Image from 'next/image';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';
import tailoringImage from '../../../public/images/tailoring.png';
import laundryImage from '../../../public/images/laundry.png';
import cobblerImage from '../../../public/images/cobbler.png';

const services = [
  {
    key: 'tailoring',
    image: tailoringImage
  },
  {
    key: 'laundry',
    image: laundryImage
  },
  {
    key: 'cobbler',
    image: cobblerImage
  }
];

const ServicesSection = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'services');

  return (
    <section className="py-16 px-6 md:px-24 bg-primary text-secondary">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold mb-8">
            {t.title || 'Our Services'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg group bg-gray-800"
            >
              <Image
                src={service.image}
                alt={t[service.key]?.title}
                width={400}
                height={480}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-primaryDark/70 group-hover:bg-opacity-80 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent group-hover:bg-opacity-80 transition-all duration-300">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {t[service.key]?.title}
                </h3>
                <p className="text-white opacity-80 overflow-hidden max-h-10 group-hover:max-h-48 transition-all duration-300 ease-in-out">
                  <span className="block group-hover:hidden">
                    {t[service.key]?.shortDescription}
                  </span>
                  <span className="hidden group-hover:block">
                    {t[service.key]?.description}
                  </span>
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

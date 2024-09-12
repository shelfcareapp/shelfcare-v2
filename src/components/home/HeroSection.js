'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';

import image1 from '../../../public/images/3E2D2574-5141-4B81-9B47-557D6233CA31.JPG';
import image2 from '../../../public/images/4A2548A6-6A01-47DE-8CB5-995E14C9D35F.JPG';
import image3 from '../../../public/images/6B280E08-7F1E-4AB2-B8AE-00E4DFE423EA.JPG';
import image4 from '../../../public/images/6DED5A29-206E-4A4B-9E14-DEB347885A27.JPG';
import image5 from '../../../public/images/6EF6B25F-E08E-459A-9AB1-7FEDF9417CB6.JPG';
import image6 from '../../../public/images/33F9DBDC-16F9-4805-8E7E-F7253D91180B.JPG';
import image7 from '../../../public/images/87E35103-6494-4C3E-B563-9F10FE534E0B.JPG';
import image8 from '../../../public/images/90B39A69-6D18-44F0-B998-DD472B4BFCF1.JPG';
import image9 from '../../../public/images/736C8CA9-7086-4A5B-A6C4-DA4771CC780A.JPG';
import image10 from '../../../public/images/3753D408-9ADD-4884-9C0E-C06B5752096F.JPG';
import image11 from '../../../public/images/B6A8E29C-A412-4D8C-B8F3-5A9A113E41B1.JPG';
import image12 from '../../../public/images/D451500B-9944-4200-9A39-ACB7A233D674.JPG';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12
];

const HeroSection = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'home-hero');

  const scrollVariant = {
    animate: {
      x: [0, -2688],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 60,
          ease: 'linear'
        }
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center min-h-screen bg-white">
      <div className="flex flex-col gap-6 items-center justify-center text-center text-primary mb-14 max-w-4xl mx-auto px-4">
        {/* <div className="flex gap-4 mb-4">
          <a
            href="https://www.instagram.com/shelfcare.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              className="text-primary hover:text-primaryDark"
              size={30}
            />
          </a>
          <a
            href="https://www.tiktok.com/@shelfcare.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok
              className="text-primary hover:text-primaryDark"
              size={30}
            />
          </a>
        </div> */}
        <h1 className="text-3xl md:text-6xl font-bold mb-2 leading-tight">
          {t.title}
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
          {t.subtitle}
        </p>
        <button className="btn-primary">{t.cta}</button>
      </div>

      <div className="relative overflow-hidden w-full h-full">
        <motion.div
          className="flex space-x-4"
          variants={scrollVariant}
          animate="animate"
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                width={224}
                height={224}
                quality={75}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          ))}
          {images.map((src, index) => (
            <div
              key={`repeat-${index}`}
              className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={src}
                alt={`Gallery Image Repeat ${index + 1}`}
                width={224}
                height={224}
                quality={75}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

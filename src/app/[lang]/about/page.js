'use client';

import Image from 'next/image';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';
import image from '../../../../public/images/F92723E0-595D-4944-B8E1-57870BF67F86.JPG';

const teamMembers = [
  {
    name: 'Maija Tunturi',
    role: 'Founder & CEO',
    image
  },
  {
    name: 'Ida',
    role: 'Founder & CM',
    image
  },
  {
    name: 'Petra Komppula',
    role: 'Founder & CMO',
    image
  },
  {
    name: 'Josephine Gyamera',
    role: 'Founder & CTO',
    image
  }
];

const About = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'team') || {};

  return (
    <section className="py-12 bg-gray-50">
      <div id="team" className="container mx-auto px-4">
        <h2 className="text-5xl text-primary font-semibold text-center mb-4">
          {t?.title || 'Meet our beautiful team'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t?.description ||
            'Our values are simple, we believe in circularity, self-expression, and self-care.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 justify-items-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative group w-full max-w-xs">
              <div className="overflow-hidden rounded-lg shadow-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-80 p-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {member.name}
                  </h3>
                  <p className="text-gray-700">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          id="contact"
          className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-semibold text-center mb-6 text-primary">
            {t?.contact?.title || 'Get in touch'}
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t?.contact?.firstName || 'First name'}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder={t?.contact?.lastName || 'Last name'}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder={t?.contact?.email || 'Email'}
              className="border p-2 rounded md:col-span-2"
            />
            <input
              type="text"
              placeholder={t?.contact?.phone || 'Phone number'}
              className="border p-2 rounded md:col-span-2"
            />
            <textarea
              placeholder={t?.contact?.message || 'Message'}
              className="border p-2 rounded md:col-span-2"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="btn-primary w-full md:col-span-2 mt-4"
            >
              {t?.contact?.submit || 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default About;

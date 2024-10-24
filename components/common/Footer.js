'use client';

import Link from 'next/link';
import { FaInstagramSquare } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="px-8 py-8 bg-primaryDark">
      <div className="container mx-auto flex justify-between items-center md:flex-nowrap flex-wrap">
        <Link href="/" className="cursor-pointer">
          <h2 className="font-bold text-4xl md:text-8xl text-secondary">
            ShelfCare
          </h2>
        </Link>
        <div className="flex md:flex-nowrap flex-wrap md:mt-0 mt-4 items-start justify-start gap-12 text-base text-secondary">
          <div>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/price-list"
                  className="hover:underline text-secondary"
                >
                  {t('footer.price_list')}
                </Link>
              </li>
              <li>
                <Link
                  href="/measurement-guide"
                  className="hover:underline text-secondary"
                >
                  {t('footer.measurement_guide')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about#contact"
                  className="hover:underline text-secondary"
                >
                  {t('footer.contact_us')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:underline text-secondary">
                  {t('footer.terms_and_conditions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:underline text-secondary"
                >
                  {t('footer.privacy_policy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-[.5px] bg-secondary my-8 md:mx-16"></div>
      <div className="flex justify-between items-center md:flex-nowrap flex-wrap md:mx-16">
        <p className="text-secondary text-sm font-light">
          {t('footer.copyright')}
        </p>
        <div className="flex gap-4 mt-4 mb-4">
          <a href="https://www.instagram.com/shelfcare.app/" target="_blank">
            <FaInstagramSquare
              className="text-secondary hover:text-white"
              size={30}
            />
          </a>
          <a href="https://www.tiktok.com/@shelfcare.app" target="_blank">
            <AiFillTikTok
              className="text-secondary hover:text-white"
              size={30}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

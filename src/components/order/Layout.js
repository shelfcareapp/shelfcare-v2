'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowRight,
  FaArrowLeft,
  FaShoppingCart,
  FaHome
} from 'react-icons/fa';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';
import sideBarImage from '../../../public/images/order-page.png';

const OrderLayout = ({
  children,
  orderCount = 0,
  title = 'Order Page',
  disableBack = false,
  disableContinue = false,
  onContinue,
  onBack,
  onOrderClick,
  confirmButtonText
}) => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'common');

  const handleOrderClick = () => {
    if (onOrderClick) {
      onOrderClick();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex w-64 bg-gray-100">
        <Image
          src={sideBarImage}
          width={256}
          height={512}
          alt="Order Sidebar"
          className="object-cover h-full"
        />
      </aside>

      <div className="flex flex-col flex-1 p-4 md:p-10 overflow-hidden">
        <Link href="/" className="cursor-pointer mb-4">
          <div className="flex items-center gap-2 hover:text-primaryDark">
            <FaHome className="text-xl text-primary" />
            <span className="text-sm text-primary">Home / {title}</span>
          </div>
        </Link>

        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          <div
            className="relative flex items-center"
            onClick={handleOrderClick}
          >
            <FaShoppingCart className="text-3xl text-primary cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {orderCount}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full overflow-y-auto">{children}</div>

        <div className="flex gap-4 justify-between mt-4">
          <button
            className={`btn-secondary flex items-center ${
              disableBack ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onBack}
            disabled={disableBack}
          >
            <FaArrowLeft className="mr-2" /> {t.back || 'Back'}
          </button>
          <button
            className={`btn-primary flex items-center ${
              disableContinue ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onContinue}
            disabled={disableContinue}
          >
            {t.confirmButtonText || t.continue}
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderLayout;

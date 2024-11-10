'use client';

import { ReactNode, useMemo } from 'react';
import Image from 'next/image';
import Logo from './Logo';
// @ts-expect-error working on it
import imgSrc from '../../public/images/3753D408-9ADD-4884-9C0E-C06B5752096F.JPG';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const rightSideImage = useMemo(
    () => (
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          alt="An image of Shelfcare model holding a cup of coffee"
          src={imgSrc}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    ),
    []
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Logo textSize="text-xl" color="text-primary" />
          {children}
        </div>
      </div>

      {rightSideImage}
    </div>
  );
}

'use client';
import Link from 'next/link';

type LogoProps = {
  textSize?: string;
};

export default function Logo({ textSize }: LogoProps) {
  return (
    <Link
      href="/"
      className={`${
        textSize ? textSize : 'text-3xl'
      } font-extrabold text-primary`}
    >
      <h1>ShelfCare</h1>
    </Link>
  );
}

'use client';
import Link from 'next/link';

type LogoProps = {
  textSize?: string;
  color?: string;
};

export default function Logo({ textSize, color }: LogoProps) {
  return (
    <Link
      href="/"
      className={`
      ${color ? color : 'text-secondary'} 
      ${textSize ? textSize : 'text-3xl'} font-extrabold font-walbaum`}
    >
      <h1>ShelfCare</h1>
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { FaInstagramSquare } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className="px-8 py-4 bg-primaryDark">
      <div className="container mx-auto flex justify-between items-center md:flex-nowrap flex-wrap">
        <h2 className="font-bold text-4xl md:text-9xl text-secondary">
          ShelfCare
        </h2>
        <div className="space-y-8 text-base text-secondary">
          <div>
            <h3 className="font-regular mb-4">Address</h3>
            <p className="font-light text-secondary text-sm">
              Helsinki, Finland
            </p>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/measurement-guide" className="hover:underline">
                  Measurement Guide
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:underline">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="h-[.5px] bg-secondary my-8"></div>
      <div className="flex justify-between items-center md:flex-nowrap flex-wrap">
        <p className="text-secondary text-sm font-light">
          &copy; 2021 ShelfCare. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 mb-4">
          <a href="https://www.instagram.com/shelfcare.app/" target="_blank">
            <FaInstagramSquare className="text-secondary" size={30} />
          </a>
          <a href="https://www.tiktok.com/@shelfcare.app" target="_blank">
            <AiFillTikTok className="text-secondary" size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

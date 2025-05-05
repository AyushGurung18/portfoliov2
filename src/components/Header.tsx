'use client';

import { useState } from 'react';
import Link from 'next/link';
import Contact from './Contact'; // Adjust the path if needed

const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <header className="bg-black text-white text-lg tracking-tighter font-semibold z-50 fixed w-full top-0 left-0 custom-header">
        <div className="w-full">
          <div className="py-6 max-w-[1200px] mx-auto px-8 border-b border-[#1E2029]">
            <nav className="flex justify-between items-center">
              <div>
                <Link href="/">Home</Link>
              </div>
              <ul className="flex items-center">
                <li>
                  <Link
                    href="/projects"
                    className="py-2 rounded-md transition-all duration-300 ease-in-out"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="py-2 rounded-md transition-all duration-300 ease-in-out"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="py-2 rounded-md transition-all duration-300 ease-in-out"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Contact Popup */}
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;

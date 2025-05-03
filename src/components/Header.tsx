import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-black text-white text-lg tracking-tighter font-semibold z-50 fixed w-full top-0 left-0 custom-header">
      <div className="w-full">
        <div className="py-6 max-w-[1200px] mx-auto px-8 border-b border-[#1E2029]">
          <nav className="flex justify-between items-center">
            <div>
              <Link href="/">Home</Link>
            </div>
            <ul className="flex ">
              <li>
                <Link
                  href="/projects"
                  className="py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-[#080808] hover:text-white"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-[#080808] hover:text-white"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-[#080808] hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useRef } from 'react';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { motion, useInView } from 'framer-motion';
import useSWR from 'swr';
import Link from 'next/link';

// Type definition
interface Blog {
  id: string | number;
  title: string;
  summary: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Blogs = () => {
  const { data } = useSWR<Blog[]>('/api/blogs', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 60 * 24, // 24 hours
  });
  const blogs = data || [];

  const blogsRef = useRef(null);
  const contactRef = useRef(null);

  const areBlogsInView = useInView(blogsRef, { margin: '-50px 0px', once: false });
  const isContactInView = useInView(contactRef, { margin: '-100px 0px', once: false });

  const blogsContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const contactContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-10 tracking-tighter">
        <div className="flex justify-between items-center mb-6">
          <div className="flex text-xl sm:text-2xl items-center">
            <IoNewspaperOutline />
            &nbsp;
            <h2 style={{ fontFamily: 'Ubuntu, sans-serif' }} className="text-2xl font-bold">
              Latest Articles
            </h2>
          </div>
          {/* Add prefetch to "View all articles" link */}
          <Link href="/blogs" prefetch>
            <span className="lg:text-base text-xs text-[#3CCF91] hover:text-[#2ba577] transition-colors inline-flex items-center">
              View all articles →
            </span>
          </Link>
        </div>

        <div ref={blogsRef}>
          {blogs.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={blogsContainerVariants}
              initial="hidden"
              animate={areBlogsInView ? 'visible' : 'hidden'}
            >
              {blogs.map((blog: Blog) => {
                const slug = blog.title
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-');

                return (
                  <Link key={blog.id} href={`/blogs/${slug}`} prefetch>
                    <motion.div
                      variants={itemVariants}
                      className="p-6 border border-[#111111] rounded-lg bg-[#080808] hover:bg-[#0D0D0D] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group"
                    >
                      <h3 className="lg:text-2xl text-lg font-bold group-hover:text-[#3CCF91] transition-colors duration-200">
                        {blog.title}
                      </h3>
                      <p className="lg:text-base text-sm font-semibold text-gray-400 mt-2">
                        {blog.summary}
                      </p>
                      {/* Add "Read more" indicator for better UX */}
                      <div className="mt-4 pt-2 border-t border-[#1E2029]">
                        <span className="text-[#3CCF91] text-sm font-medium group-hover:text-[#2ba577] transition-colors">
                          Read more →
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Contact Section */}
        <div ref={contactRef} className="py-20">
          <motion.div
            variants={contactContainerVariants}
            initial="hidden"
            animate={isContactInView ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants} className="py-10 mt-5 sm:mt-20 flex flex-col text-center">
              <h1 className="sm:text-5xl text-4xl font-bold mb-10 mt-6">Keep in Touch</h1>
              <h2 className="text-sm sm:text-base text-[#869094]">
                I&apos;m currently specializing in{' '}
                <span className="text-[#3CCF91] hover:text-[#2ba577]">Full-stack Development</span>
              </h2>
              <h2 className="text-sm sm:text-base text-[#869094]">
                Feel free to get in touch and talk more about your projects.
              </h2>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} variants={itemVariants} className="flex gap-4 justify-center">
              <a 
                href="https://github.com/ayushgurung18" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex space-x-2 sm:px-6 px-3 py-2 text-base font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer transition-colors duration-200"
              >
                <FaGithub size={20} color="#3CCF91" />
                <span className="md:text-base text-sm">Github</span>
              </a>
              <a 
                href="https://linkedin.com/in/ayushgurung" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex space-x-2 sm:px-6 px-3 py-2 text-base items-center font-semibold text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer transition-colors duration-200"
              >
                <FaLinkedin size={20} color="#3CCF91" />
                <span className="md:text-base text-sm">LinkedIn</span>
              </a>
              <a 
                href="mailto:ayushgurung18sep@gmail.com"
                className="flex space-x-2 sm:px-6 px-3 py-2 text-base font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer transition-colors duration-200"
              >
                <MdEmail size={20} color="#3CCF91" />
                <span className="md:text-base text-sm">Email</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
    </div>
  );
};

export default Blogs;
'use client';

import { useRef } from 'react';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { motion, useInView } from 'framer-motion';
import useSWR from 'swr';

// Sample blog data to use instead of fetching
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Blogs = () => {

  const { data } = useSWR('/api/blogs', fetcher);
  const blogsRef = useRef(null);
  const contactRef = useRef(null);
  
  const areBlogsInView = useInView(blogsRef, {
    margin: '-50px 0px',
    once: false,
  });
  
  const isContactInView = useInView(contactRef, {
    margin: '-100px 0px',
    once: false,
  });

  // Animation variants
  const blogsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const contactContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-10 tracking-tighter">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontFamily: 'Ubuntu, sans-serif' }} className="text-4xl font-bold mb-4 flex items-center">
            <IoNewspaperOutline /> &nbsp;Latest Articles
          </h2>
          <a className="text-xl text-[#3CCF91] hover:text-[#2ba577] transition-colors inline-flex items-center" href="#">
            View all articles →
          </a>
        </div>

        {/* Blog section with animation */}
        <div ref={blogsRef}>
          {data && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={blogsContainerVariants}
              initial="hidden"
              animate={areBlogsInView ? "visible" : "hidden"}
            >
              {data.map((blog: any) => (
                <motion.div
                  key={blog.id}
                  variants={itemVariants}
                  className="p-6 border border-[#111111] rounded-lg bg-[#080808] hover:bg-[#0D0D0D] transition duration-300 cursor-pointer flex flex-col justify-between h-full"
                >
                  <h3 className="text-2xl font-bold">{blog.title}</h3>
                  <p className="text-sm font-semibold text-gray-400 mt-2">{blog.summary}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Contact section with its own animation */}
        <div ref={contactRef} className="pt-24">
          <motion.div
            variants={contactContainerVariants}
            initial="hidden"
            animate={isContactInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="py-10 mt-20 flex flex-col items-center">
              <h1 className="text-5xl font-bold mb-10 mt-6">Keep in Touch</h1>
              <h3 className="text-xl text-[#869094]">
                I'm currently specializing in <span className="text-[#3CCF91] hover:text-[#2ba577]">Full-stack Development</span>
              </h3>
              <h3 className="text-xl text-[#869094] mb-6">
                Feel free to get in touch and talk more about your projects.
              </h3>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} variants={itemVariants} className="mt-6 flex flex-wrap gap-4 justify-center">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <div className="flex space-x-2 px-6 py-2 text-md font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer">
                  <FaGithub size={20} color="#3CCF91" />
                  <span>Github</span>
                </div>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <div className="flex space-x-2 px-6 py-2 text-md items-center font-semibold text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer">
                  <FaLinkedin size={20} color="#3CCF91" />
                  <span>LinkedIn</span>
                </div>
              </a>
              <a href="mailto:your.email@example.com">
                <div className="flex space-x-2 px-6 py-2 text-md font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer">
                  <MdEmail size={20} color="#3CCF91" />
                  <span>Email</span>
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;

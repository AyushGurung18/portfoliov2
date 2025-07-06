'use client';

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";

type Blogs = {
  title: string;
  summary: string;
  date: string;
  read_time: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const rotate = useMotionValue(0);
  const rotation = useTransform(rotate, [0, 1], [0, 360]);

  const { data } = useSWR("/api/blogs", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 60, // 1 hour
  });

  const blogs: Blogs[] = Array.isArray(data) ? data : [];

  const handleRefresh = () => {
    animate(rotate, 1, {
      duration: 0.1,
      onComplete: () => {
        mutate("/api/blogs", undefined, { revalidate: true });
        rotate.set(0);
      },
    });
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="bg-black text-white p-7 my-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 my-12 mb-8">
        <h1 className="sm:text-7xl text-5xl tracking-tighter font-bold">Blog</h1>
        <br />
        <p className="text-sm sm:text-base tracking-tighter">
          This is where I share my writings on programming, tutorials, and my experiences.
        </p>
        <div className="flex items-center mt-4 justify-between">
          <input
            type="text"
            placeholder="Search articles"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-[#1E2029] w-96 text-white border border-[#3CCF91] rounded"
          />
          <motion.div className="ms-8 flex justify-end" style={{ rotate: rotation }}>
            <FiRefreshCw
              className="cursor-pointer text-[#3CCF91] hover:text-[#2ba577] transition-colors"
              size={20}
              onClick={handleRefresh}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1">
        <AnimatePresence>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <motion.div
                key={`${blog.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, duration: 1 }}
                className="border-t border-[#1E2029] py-6"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-36 md:shrink-0 text-left md:text-right text-sm text-[#7f8b97] leading-relaxed mb-4 md:mb-0 md:me-3">
                    <p className="mb-1 text-sm sm:text-base">{blog.date}</p>
                    <p className="mb-1">{blog.read_time}</p>
                  </div>

                  <div className="flex flex-col md:ml-14">
                    <Link 
                      href={`/blogs/${blog.title.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="group"
                      prefetch
                    >
                      <h3 className="text-[#fffefd] text-xl sm:text-2xl font-semibold group-hover:underline transition-all duration-200">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="my-1 text-sm sm:text-base text-[#7f8b97]">{blog.summary}</p>
                    <Link
                      href={`/blogs/${blog.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#3CCF91] text-sm mt-1 hover:underline transition-all duration-200 inline-flex items-center w-fit"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-[#7f8b97]">
              {searchTerm ? "No blogs found matching your search." : "No blogs available."}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Blogs;

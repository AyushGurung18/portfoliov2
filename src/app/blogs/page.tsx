"use client";

import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";

type Blogs = {
  title: string;
  summary: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LoadingSpinner = () => {
  return (
    <motion.div
      className="w-8 h-8 rounded-full border-4 border-dashed border-[#3CCF91] animate-spin"
      style={{ borderColor: "#3CCF91 transparent #3CCF91 transparent" }}
      animate={{ rotate: 360 }}
      transition={{ loop: Infinity, duration: 0.7 }}
    />
  );
};

const Blogs = () => {
  // Add a flag to track if we're running on client side
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update SWR to revalidate on mount to ensure consistent data
  const { data, error, isLoading } = useSWR("/api/blogs", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 1000 * 60 * 60 * 24, // 24 hours
    suspense: false,
  });

  const rotate = useMotionValue(0);
  const rotation = useTransform(rotate, [0, 1], [0, 360]);

  // Set isMounted to true after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    animate(rotate, 1, {
      duration: 0.1,
      onComplete: () => {
        mutate("/api/blogs", undefined, { revalidate: true });
        rotate.set(0);
        setIsRefreshing(false);
      },
    });
  };

  const blogs: Blogs[] = isMounted && data ? data : [];

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show nothing during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (error) return <div className="text-red-500">Failed to load blogs.</div>;

  return (
    <motion.div
      className="bg-black text-white p-7 my-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 my-12 mb-8">
        <h1 className="text-7xl tracking-tighter font-bold">Blog</h1>
        <br />
        <p className="text-lg tracking-tighter">
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
          <motion.div
            className="flex justify-end"
            style={{ rotate: rotation }}
          >
            <FiRefreshCw
              className="cursor-pointer text-[#3CCF91] hover:text-[#2ba577] transition-colors"
              size={20}
              onClick={handleRefresh}
            />
          </motion.div>
        </div>
      </div>

      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <AnimatePresence>
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, duration: 1 }}
                className="flex border-b border-[#1E2029] py-6"
              >
                {/* Left side: Date + Read Time (mocked for now) */}
                <div className="w-36 shrink-0 text-sm text-[#7f8b97] leading-relaxed">
                  <p className="mb-1">Jan 21 2025</p> {/* Replace with actual blog date */}
                  <p>6 min read</p> {/* Replace with actual read time */}
                </div>

                {/* Right side: Content */}
                <div className="flex flex-col">
                  <Link href={`/blogs/${blog.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <h3 className="text-white text-lg font-semibold hover:underline">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-[#a0aab7] mt-1 text-sm">{blog.summary}</p>
                  <Link
                    href={`/blogs/${blog.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#3CCF91] text-sm mt-1 hover:underline"
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            ))}

          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Blogs;
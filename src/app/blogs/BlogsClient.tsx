'use client';

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { Search, RefreshCw, Clock, Calendar, ArrowRight } from "lucide-react";

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

  const { data, isLoading } = useSWR("/api/blogs", fetcher, {
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-8 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium tracking-wide text-[#3CCF91] mb-3">Writing</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight mb-5">
            Notes &amp; Essays
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            Thoughts on programming, systems I&apos;m building, and things I&apos;ve learned along the way.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search articles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#3CCF91]/60 focus:bg-white/[0.06]"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh articles"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-colors hover:border-[#3CCF91]/60 hover:text-[#3CCF91]"
              style={{ rotate: rotation }}
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="divide-y divide-white/10 border-t border-white/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse py-8">
                <div className="mb-3 h-3 w-32 rounded bg-white/10" />
                <div className="mb-3 h-7 w-3/4 rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-white/10">
            <AnimatePresence>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => {
                  const slug = blog.title.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <motion.article
                      key={`${blog.title}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.5 }}
                      className="group border-b border-white/10"
                    >
                      <Link href={`/blogs/${slug}`} className="block py-8" prefetch>
                        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={12} />
                            {blog.date}
                          </span>
                          {blog.read_time && (
                            <>
                              <span className="text-gray-700">&middot;</span>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock size={12} />
                                {blog.read_time} min read
                              </span>
                            </>
                          )}
                        </div>

                        <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug text-white transition-colors group-hover:text-[#3CCF91]">
                          {blog.title}
                        </h2>

                        <p className="mt-3 text-base leading-relaxed text-gray-400 line-clamp-2">
                          {blog.summary}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#3CCF91] opacity-0 transition-opacity group-hover:opacity-100">
                          Read article
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </motion.article>
                  );
                })
              ) : (
                <div className="py-24 text-center text-gray-500">
                  {searchTerm ? "No articles found matching your search." : "No articles published yet."}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

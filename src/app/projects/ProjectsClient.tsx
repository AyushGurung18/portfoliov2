"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Search, RefreshCw } from "lucide-react";
import BeautifulError from "@/components/BeautifulError";
import Image from "next/image";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  slug: string;
};

type TechStack = {
  [key: string]: {
    color: string;
    text_color: string;
    icon: string;
  };
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

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, error, isLoading } = useSWR("/api/projects", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 1000 * 60 * 60 * 24,
    suspense: false,
  });

  const rotate = useMotionValue(0);
  const rotation = useTransform(rotate, [0, 1], [0, 360]);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    animate(rotate, 1, {
      duration: 0.1,
      onComplete: () => {
        mutate("/api/projects", undefined, { revalidate: true });
        rotate.set(0);
        setIsRefreshing(false);
      },
    });
  };

  const projects: Project[] = data?.projects || [];
  const techStack: TechStack = data?.techStack || {};

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies.some((tech) =>
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (error) {
    return (
      <BeautifulError
        title="Projects Not Found"
        description="The projects could not be loaded. Please try again later."
        backTo="/"
        backText="← Go Back"
        variant="warning"
        onRetry={() => mutate("/api/projects", undefined, { revalidate: true })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-8 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium tracking-wide text-[#3CCF91] mb-3">Portfolio</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight mb-5">
            Projects
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            I love building projects and practicing my engineering skills. Here&apos;s an archive of things that I&apos;ve worked on.
          </p>

          <div className="flex items-center gap-3 mt-8 max-w-xl">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#3CCF91]/60 focus:bg-white/[0.06]"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh projects"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-colors hover:border-[#3CCF91]/60 hover:text-[#3CCF91]"
              style={{ rotate: rotation }}
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <Link key={project.slug} href={`/projects/${project.slug}`} prefetch>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.5 }}
                      whileHover={{ y: -4 }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#3CCF91]/50"
                    >
                      <div className="relative w-full aspect-video overflow-hidden bg-white/[0.03]">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-xl font-semibold text-white mb-2 transition-colors group-hover:text-[#3CCF91]">
                          {project.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => {
                            const techInfo = techStack[tech];
                            if (!techInfo) {
                              return (
                                <span
                                  key={techIndex}
                                  className="px-2.5 py-1 text-xs rounded-full bg-white/[0.06] text-gray-300 border border-white/10"
                                >
                                  {tech}
                                </span>
                              );
                            }
                            return (
                              <span
                                key={techIndex}
                                className="px-2.5 py-1 text-xs rounded-full flex items-center gap-1"
                                style={{
                                  backgroundColor: `${techInfo.color}15`,
                                  color: techInfo.text_color,
                                  border: `1px solid ${techInfo.color}`,
                                }}
                              >
                                <i className={`icon-${techInfo.icon} text-sm`}></i>
                                {tech}
                              </span>
                            );
                          })}
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed flex-1">
                          {project.description}
                        </p>

                        <div className="mt-5 pt-4 border-t border-white/10">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-[#3CCF91]/60 hover:text-[#3CCF91]"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.github || "https://github.com", "_blank", "noopener,noreferrer");
                            }}
                          >
                            <FaGithub size={16} />
                            View Source
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-24 text-gray-500">
                  {searchTerm ? "No projects found matching your search." : "No projects available."}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

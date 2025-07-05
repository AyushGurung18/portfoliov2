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
import { FiRefreshCw } from "react-icons/fi";
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

  if (isLoading) {
    return (
      <div className="bg-black text-white p-7 my-12 flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-black text-white p-7 my-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 my-12 mb-8">
        <h1 className="sm:text-7xl text-5xl tracking-tighter font-bold">Projects</h1>
        <br />
        <p className="text-sm sm:text-base tracking-tighter">
          I love building projects and practicing my engineering skills. Here&apos;s an archive of things that I&apos;ve worked on.
        </p>
        <div className="flex items-center mt-4 justify-between">
          <input
            type="text"
            placeholder="Search Projects"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => {
              // Generate clean slug without ID
              
              return (
                <Link href={`/projects/${project.slug}`} prefetch>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ delay: index * 0.1, duration: 1 }}
                    className="bg-black pb-4 border border-[#1E2029] tracking-tighter rounded-lg shadow-lg flex flex-col h-full cursor-pointer hover:border-[#3CCF91] transition-colors duration-300"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover rounded-lg mb-4"
                      width={600}
                      height={400}
                      priority={index === 0}
                    />
                    <div className="px-4 flex flex-col flex-grow">
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => {
                          const techInfo = techStack[tech];
                          if (!techInfo) {
                            // Fallback for technologies not in techStack
                            return (
                              <span
                                key={techIndex}
                                className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300 border border-gray-600"
                              >
                                {tech}
                              </span>
                            );
                          }
                          return (
                            <span
                              key={techIndex}
                              className="px-3 py-1 text-sm rounded-full flex items-center gap-1"
                              style={{
                                backgroundColor: `${techInfo.color}15`,
                                color: techInfo.text_color,
                                border: `1px solid ${techInfo.color}`,
                              }}
                            >
                              <i className={`icon-${techInfo.icon} text-base`}></i>
                              {tech}
                            </span>
                          );
                        })}
                      </div>
                      <hr className="border-t border-[#1E2029] mb-4" />
                      <div className="flex flex-col flex-grow">
                        <p className="text-[#869094] text-sm sm:text-base">{project.description}</p>
                        <div className="mt-auto pt-4">
                          <a
                            href={project.github || "https://github.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex space-x-2 w-auto px-6 py-2 text-base font-semibold text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent Link navigation when clicking GitHub link
                          >
                            <FaGithub size={20} />
                            <span>View Source</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-[#7f8b97]">
              {searchTerm ? "No projects found matching your search." : "No projects available."}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Projects;
"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform ,animate } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";

type Project = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
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
  const { data, error, isLoading } = useSWR("/api/projects", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 1000 * 60 * 60 * 24, // 24 hours
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rotate = useMotionValue(0);
  const rotation = useTransform(rotate, [0, 1], [0, 360]);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    animate(rotate, 1, {
      duration: 0.6,
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

  if (error) return <div className="text-red-500">Failed to load projects.</div>;

  return (
    <motion.div
      className="bg-black text-white p-7 my-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-12 my-12 mb-8">
        <h1 className="text-7xl tracking-tighter font-bold">Projects</h1>
        <br />
        <p className="text-lg tracking-tighter">
          I love building projects and practicing my engineering skills. Here's
          an archive of things that I've worked on.
        </p>
        <div className="flex items-center mt-4 justify-between">
          <input
            type="text"
            placeholder="Search projects..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, duration: 1 }}
                className="bg-black pb-4 border border-[#1E2029] tracking-tighter rounded-lg shadow-lg"
              >
                <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover rounded-lg mb-4"
                  />
                </Link>
                <div className="px-4">
                  <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <h3 className="text-2xl font-semibold mb-2 text-white">{project.title}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => {
                      const techInfo = techStack[tech];
                      if (!techInfo) return null;
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
                  <hr className="border-t border-[#1E2029] mt-4" />
                  <br />
                  <p className="text-[#869094] mb-4">{project.description}</p>
                  <Link
                    href={project.github || "https://github.com/default"}
                    className="inline-flex space-x-2 w-auto px-6 py-2 text-md font-semibold text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
                  >
                    <FaGithub size={20} />
                    <span>View Source</span>
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

export default Projects;
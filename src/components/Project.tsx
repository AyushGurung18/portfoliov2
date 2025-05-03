'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

// Types
type TechStyle = {
  color: string;
  text_color: string;
  icon: string;
};

type TechStack = {
  [key: string]: TechStyle;
};

type Project = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechStack>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects);
      setTechStack(data.techStack);
    };
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px', once: true });

  const itemVariants = {
    hidden: (isRight: boolean) => ({
      x: isRight ? 100 : -100,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <section
      className="relative max-w-[1200px] tracking-tighter mx-auto px-8 py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setActiveIndex(null);
      }}
    >
      {/* Dark overlay on entire section */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 bg-black z-10"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-20 relative z-20"
      >
        <h2 className="text-2xl font-bold mb-4">All Creative Works.</h2>
        <p className="text-xl text-[#869094] mb-6">
          Here's some of my projects that I have worked on.
        </p>
        <Link
          href="/projects"
          className="text-xl text-[#3CCF91] hover:text-[#2ba577] transition-colors inline-flex items-center"
        >
          Explore more →
        </Link>
      </motion.div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-20"
      >
        {projects.map((project, index) => {
          const isRight = index % 2 === 0;
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={index}
              custom={isRight}
              variants={itemVariants}
              className={`group flex flex-col ${
                isRight ? 'md:flex-row-reverse' : 'md:flex-row'
              } gap-12 -mt-[222px] items-center`}
            >
              <div className="w-full md:w-1/2 bg-[#080808] border border-[#1E2029] rounded-3xl" 
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  filter: isHovering && !isActive ? 'brightness(30%)' : 'brightness(100%)',
                  transition: 'filter 0.3s ease',
                }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover rounded-lg shadow-lg"
                  style={{ borderRadius: '25px 25px 0px 0px' }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => {
                      const techInfo = techStack[tech] || {
                        color: '#1E2029',
                        text_color: '#3CCF91',
                        icon: 'FaCode',
                      };
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
                  <p className="text-[#869094] mb-6 line-clamp-2">{project.description}</p>
                </div>
              </div>
              <div className="md:w-1/2"></div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Projects;

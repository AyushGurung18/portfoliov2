"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Project = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
};

const ProjectDetails = () => {
  const [project, setProject] = useState<Project | null>(null);
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch("/api/projects");
      const data = await response.json();

      const foundProject = data.projects.find((p: Project) => 
        p.title.toLowerCase().replace(/\s+/g, "-") === slug
      );

      setProject(foundProject || null);
    };

    fetchProject();
  }, [slug]);

  if (!project) {
    return <div className="text-white p-8">Project not found!</div>;
  }

  return (
    <div className="p-8 pt-12 mt-12 bg-black text-white min-h-screen">
      <h1 className="text-5xl font-bold">{project.title}</h1>
      <p className="text-lg mt-4 text-gray-400">{project.description}</p>
      <img
        src={project.image}
        alt={project.title}
        className="w-full max-w-3xl my-6 rounded-lg"
      />

      <nav className="mt-8">
        <h2 className="text-3xl font-semibold">Table of Contents</h2>
        <ul className="list-disc list-inside mt-4">
          <li>
            <a href="#overview" className="text-blue-400 hover:underline">
              Overview
            </a>
          </li>
          <li>
            <a href="#tech-stack" className="text-blue-400 hover:underline">
              Tech Stack
            </a>
          </li>
          <li>
            <a href="#github-repo" className="text-blue-400 hover:underline">
              GitHub Repository
            </a>
          </li>
        </ul>
      </nav>

      <section id="overview" className="mt-8">
        <h3 className="text-2xl font-semibold">Overview</h3>
        <p className="mt-2 text-gray-400">{project.description}</p>
      </section>

      <section id="tech-stack" className="mt-8">
        <h3 className="text-2xl font-semibold">Tech Stack</h3>
        <ul className="list-disc list-inside mt-4">
          {project.technologies.map((tech, index) => (
            <li key={index} className="text-gray-300">
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <section id="github-repo" className="mt-8">
        <h3 className="text-2xl font-semibold">GitHub Repository</h3>
        <Link
          href={project.github}
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          View Source on GitHub
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetails;

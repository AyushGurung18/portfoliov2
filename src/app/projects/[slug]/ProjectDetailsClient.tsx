'use client';

import { TextareaForm } from "@/components/CommentBox";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

interface ContentSection {
  id: string;
  title: string;
  content: string | string[];
}

interface ProjectDetails {
  title: string;
  description: string;
  image: string;
  project_id: string;
  project_url: string;
  content_sections: ContentSection[];
  technologies: string[];
  github: string;
}

interface Props {
  project: ProjectDetails;
  slug: string;
}

export default function ProjectDetailsPage({ project, slug }: Props) {
  const router = useRouter();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>("");

  // Instant back navigation - no delays, no BS
  const handleBackNavigation = () => {
    router.back();
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = 120;
      const sectionElements = Object.entries(sectionRefs.current)
        .filter(([, el]) => el)
        .map(([title, el]) => ({ title, el: el! }));

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
        setActiveSection(sectionElements.at(-1)?.title ?? "");
        return;
      }

      let current = "";
      for (const { title, el } of sectionElements) {
        if (el.getBoundingClientRect().top <= offset) {
          current = title;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderSectionContent = (content: string | string[] | undefined) => {
    if (!content) return null;
    return Array.isArray(content)
      ? (
        <ul className="list-disc pl-5 text-gray-300">
          {content.map((item, idx) => (
            <li key={idx} className="mb-2">{item}</li>
          ))}
        </ul>
      )
      : <div className="text-gray-300 whitespace-pre-line">{content}</div>;
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-12">
      {/* Back button - instant response */}
      <div className="border-b border-[#1E2029] pb-8">
        <button
          onClick={handleBackNavigation}
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block transition-colors duration-150 hover:translate-x-[-2px]"
        >
          ← Back to Projects
        </button>
        
        {/* Hero Image */}
        <Image 
          src={project.image} 
          alt={project.title} 
          width={1200}
          height={600}
          className="w-full rounded-xl mb-10 shadow-xl"
          priority
        />
        
        {/* Title */}
        <h1 className="sm:text-4xl text-3xl my-3 font-extrabold">
          {project.title}
        </h1>

        <p className="my-2 text-sm sm:text-base text-gray-400">{project.description}</p>
        
        <Link
          href={project.project_url}
          target="_blank"
          className="flex items-center text-green-400 text-sm sm:text-base hover:text-green-300 transition-colors"
        >
          <FaGithub className="mr-2" /> Live Site
        </Link>
      </div>  

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-12 mt-10">
        {/* Main Content */}
        <div className="flex-1">
          {project.content_sections?.map((section, index) => (
            <section
              key={index}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.title] = el;
              }}
              className="mb-12 scroll-mt-48"
            >
              <h2 className="flex sm:text-3xl text-2xl font-bold mb-4">
                <span className="w-1 h-8 bg-green-500 block rounded mr-3"></span>
                {section.title}
              </h2>
              {renderSectionContent(section.content)}
            </section>
          ))}

          {/* Technologies Section */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="mb-12">
              <h2 className="flex sm:text-3xl text-2xl font-bold mb-4">
                <span className="w-1 h-8 bg-green-500 block rounded mr-3"></span>
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 text-green-400 rounded-md text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* GitHub Section */}
          {project.github && (
            <section className="mb-12">
              <h2 className="flex sm:text-3xl text-2xl font-bold mb-4">
                <span className="w-1 h-8 bg-green-500 block rounded mr-3"></span>
                Source Code
              </h2>
              <Link
                href={project.github}
                target="_blank"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FaGithub className="mr-2" /> View on GitHub
              </Link>
            </section>
          )}
        </div>

        {/* Table of Contents */}
        <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 self-start hidden md:block">
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {project.content_sections?.map((section, index) => (
              <li key={index}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={clsx(
                    "hover:text-green-400 text-sm block transition-colors",
                    activeSection === section.title
                      ? "text-green-500 font-semibold"
                      : "text-gray-400"
                  )}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Comment Section */}
      <div className="space-y-8 mt-16">
        <TextareaForm page={`project/${slug}`} />
      </div>
    </div>
  );
}
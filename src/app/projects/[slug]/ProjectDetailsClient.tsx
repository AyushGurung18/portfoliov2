'use client';

import useSWR from "swr";
import { TextareaForm } from "@/components/CommentBox";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import { FaGithub } from "react-icons/fa";
import BeautifulError from "@/components/BeautifulError";
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
  initialData: ProjectDetails;
  slug: string;
}

export default function ProjectDetailsPage({ initialData, slug }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const projectId = pathname?.split("/").pop() || "";
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState(false);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then((data) => data.project[0]);

  const { data: project, error, isLoading, mutate } = useSWR<ProjectDetails>(
    `/api/project_details?slug=${projectId}`,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: false, // Changed from true to false
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 2000,
      // Add these for better performance
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  const handleRetry = () => {
    mutate();
  };

  // Enhanced back navigation with immediate feedback
  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    
    // Add immediate visual feedback
    document.body.style.cursor = 'wait';
    
    // Use router.back() if possible, otherwise navigate to projects
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/projects');
    }
    
    // Reset cursor after a short delay
    setTimeout(() => {
      document.body.style.cursor = 'default';
      setIsNavigating(false);
    }, 500);
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
      if (!project) return;
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
  }, [project]);

  const renderSectionContent = (content: string | string[] | undefined) => {
    if (!content) return null;
    return Array.isArray(content)
      ? (
        <ul className="list-disc pl-5 text-white-300">
          {content.map((item, idx) => (
            <li key={idx} className="mb-2">{item}</li>
          ))}
        </ul>
      )
      : <div className="text-white-300 whitespace-pre-line">{content}</div>;
  };

  // Show loading state only when there's no initial data
  if (isLoading && !initialData) return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-12">
      {/* Back button skeleton */}
      <div className="mb-8">
        <Skeleton className="h-6 w-32 bg-gray-800" />
      </div>
      
      {/* Hero image skeleton */}
      <Skeleton className="w-full h-64 md:h-80 rounded-xl mb-10 bg-gray-800" />
      
      {/* Title skeleton */}
      <div className="flex items-center gap-3 mb-10">
        <Skeleton className="w-1 h-8 rounded bg-gray-800" />
        <Skeleton className="h-10 w-3/4 max-w-md bg-gray-800" />
      </div>
      
      {/* Content layout */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Main content skeletons */}
        <div className="flex-1">
          {/* Section 1 */}
          <div className="mb-12">
            <Skeleton className="h-8 w-64 mb-4 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-3/4 bg-gray-800" />
          </div>
          
          {/* Section 2 */}
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-4 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-800" />
          </div>
          
          {/* Tech stack section */}
          <div className="mb-12">
            <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />
            <div className="flex flex-wrap gap-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-md bg-gray-800" />
              ))}
            </div>
          </div>
          
          {/* GitHub section */}
          <div className="mb-12">
            <Skeleton className="h-8 w-56 mb-4 bg-gray-800" />
            <Skeleton className="h-6 w-40 bg-gray-800" />
          </div>
        </div>
        
        {/* Table of contents skeleton */}
        <aside className="w-full md:w-64 flex-shrink-0 sticky top-20 self-start hidden md:block">
          <Skeleton className="h-8 w-48 mb-4 bg-gray-800" />
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full bg-gray-800" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );

  if (error) {
    return (
      <BeautifulError 
        error={error}
        description={
        error.includes('not found')
          ? `The Project "${projectId}" could not be found. It may have been moved or deleted.`
          : 'We encountered an error while loading the project. Please try again.'
      }
        onRetry={handleRetry}
        backTo="/projects"
        backText="← Back to Projects"
        variant={error.includes('not found') ? 'warning' : 'error'}
      />
    );
  }

  // Use initialData if available, otherwise use SWR data
  const currentProject = project || initialData;

  // Early return if no project data is available
  if (!currentProject) {
    return (
      <BeautifulError 
        error="Project data not available"
        onRetry={handleRetry}
        backTo="/projects"
        backText="← Back to Projects"
      />
    );
  }

  return (
    <div className={clsx(
      "min-h-screen bg-black text-white px-6 md:px-20 py-12 relative transition-opacity duration-300",
      isNavigating && "opacity-50"
    )}>
      {/* Back button with enhanced interaction */}
      <div className="border-b border-[#1E2029] pb-8">
        <button
          onClick={handleBackNavigation}
          className={clsx(
            "text-blue-400 hover:text-blue-300 mb-8 inline-block transition-all duration-200",
            "hover:translate-x-[-4px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-2 py-1",
            isNavigating && "opacity-50 cursor-wait"
          )}
          disabled={isNavigating}
        >
          ← Back to Projects
        </button>
        
        {/* Full-width Hero Image */}
        <Image 
          src={currentProject.image} 
          alt={currentProject.title} 
          width={1200}
          height={600}
          className="w-full rounded-xl mb-10 shadow-xl"
          priority
        />
        
        {/* Title */}
        <h1 className="sm:text-4xl text-3xl my-3 font-extrabold flex items-center gap-3">
          {currentProject.title}
        </h1>

        <p className="my-2 text-sm sm:text-base text-gray-400">{currentProject.description}</p>
        <Link
          href={currentProject.project_url}
          target="_blank"
          className="flex items-center text-green-400 text-sm sm:text-base hover:text-green-300 transition-colors"
        >
          <FaGithub className="mr-2" /> Live Site
        </Link>
      </div>  

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-12 mt-10">
        {/* Main Content */}
        <div className="flex-1">
          {currentProject.content_sections?.map((section, index) => {
            return (
              <section
                key={index}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.title] = el;
                }}
                className="mb-12 scroll-mt-48"
              >
                <h2 className="flex sm:text-3xl text-2xl font-bold mb-2">
                  <span className="w-1 h-8 bg-green-500 block rounded mr-3"></span>
                  {section.title}
                </h2>
                {renderSectionContent(section.content)}
              </section>
            );
          })}
        </div>

        {/* Table of Contents */}
        <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 self-start hidden md:block">
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {currentProject.content_sections?.map((section, index) => {
              return (
                <li key={index}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={clsx(
                      "hover:text-green-400 text-sm block transition",
                      activeSection === section.title
                        ? "text-green-500 font-semibold"
                        : "text-gray-400"
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              );
            })}
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
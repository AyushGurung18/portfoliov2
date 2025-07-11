'use client';

import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { TextareaForm } from '@/components/CommentBox';
import Link from 'next/link';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import { FaGithub } from 'react-icons/fa';
import BeautifulError from '@/components/BeautifulError';
import Image from 'next/image';

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

interface APIError {
  error: string;
  errorType?: 'not_found' | 'bad_request' | 'server_error';
  slug?: string;
}

export default function ProjectDetailsPage({ slug, initialData }: Props) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>('');

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      const error = new Error(err.error || 'Unknown error') as Partial<APIError> & { status?: number };
      error.status = res.status;
      error.errorType = err.errorType;
      error.slug = err.slug;
      throw error;
    }
    const data = await res.json();
    return data.project[0];
  };

  const { data: project, error, isLoading, mutate } = useSWR<ProjectDetails>(
    `/api/project_details?slug=${slug}`,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60 * 5, // every 5 min
      dedupingInterval: 2000,
    }
  );

  const handleRetry = () => mutate();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    if (!project?.content_sections?.length) return;

    const handleScroll = () => {
      const offset = 120;
      const sectionElements = Object.entries(sectionRefs.current)
        .filter(([, el]) => el)
        .map(([title, el]) => ({ title, el: el! }));

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
        setActiveSection(sectionElements.at(-1)?.title ?? '');
        return;
      }

      let current = '';
      for (const { title, el } of sectionElements) {
        if (el.getBoundingClientRect().top <= offset) {
          current = title;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [project]);

  const renderSectionContent = (content: string | string[] | undefined) => {
    if (!content) return null;
    return Array.isArray(content) ? (
      <ul className="list-disc pl-5 text-gray-300">
        {content.map((item, idx) => (
          <li key={idx} className="mb-2">{item}</li>
        ))}
      </ul>
    ) : (
      <div className="text-gray-300 whitespace-pre-line">{content}</div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-12">
        <Skeleton className="h-6 w-32 bg-gray-800 mb-8" />
        <Skeleton className="w-full h-64 md:h-80 rounded-xl mb-10 bg-gray-800" />
        <div className="flex items-center gap-3 mb-10">
          <Skeleton className="w-1 h-8 rounded bg-gray-800" />
          <Skeleton className="h-10 w-3/4 max-w-md bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error) {
    const typedError = error as Partial<APIError> & { status?: number };
    const errorType = typedError.errorType;
    const errorStatus = typedError.status;

    if (errorType === 'not_found' || errorStatus === 404) {
      return <BeautifulError title="Project Not Found" error={error.message} backTo="/projects" variant="warning" />;
    }

    return <BeautifulError title="Error" error={error.message} onRetry={handleRetry} backTo="/projects" variant="error" />;
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="border-b border-gray-800 pb-8">
        <Link href="/projects" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to Projects
        </Link>

        <Image
          src={project.image}
          alt={project.title}
          width={1200}
          height={600}
          className="w-full rounded-xl mb-10 shadow-xl"
          priority
        />

        <h1 className="sm:text-4xl text-3xl my-3 font-extrabold">{project.title}</h1>
        <p className="my-2 text-sm sm:text-base text-gray-400">{project.description}</p>

        {project.project_url && (
          <Link href={project.project_url} target="_blank" className="text-green-400 flex items-center gap-2 text-sm hover:underline">
            <FaGithub /> Live Site
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12 mt-10">
        <div className="flex-1">
          {project.content_sections?.map((section, index) => (
            <section
              key={index}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.title] = el; }}
              className="mb-12 scroll-mt-48"
            >
              <h2 className="sm:text-3xl text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-green-500 block rounded"></span>
                {section.title}
              </h2>
              {renderSectionContent(section.content)}
            </section>
          ))}
        </div>

        <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 self-start hidden md:block">
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {project.content_sections.map((section, index) => (
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
            ))}
          </ul>
        </aside>
      </div>

      <div className="space-y-8 mt-16">
        <TextareaForm page={`project/${slug}`} />
      </div>
    </div>
  );
}

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
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';

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
      <ul className="list-disc marker:text-[#3CCF91] pl-5 space-y-2.5 text-[1.05rem] leading-[1.85] text-gray-300">
        {content.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="whitespace-pre-line text-[1.05rem] leading-[1.85] text-gray-300">
        {content}
      </p>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-8 md:pt-36">
          <Skeleton className="h-4 w-28 mb-10" />
          <Skeleton className="h-11 w-full max-w-lg mb-3" />
          <Skeleton className="h-11 w-2/3 max-w-sm mb-6" />
          <Skeleton className="h-5 w-full max-w-md mb-8" />
          <div className="flex gap-2 pb-8 border-b border-white/10">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <Skeleton className="w-full h-64 md:h-96 rounded-2xl" />
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
    <>
      <ReadingProgressBar />
      <article className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-8 md:pt-36">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-[#3CCF91] mb-10"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Projects
          </Link>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-5">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed font-light mb-8">
              {project.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-white/10">
            {project.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/[0.06] text-gray-300 border border-white/10"
              >
                {tech}
              </span>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {project.project_url && (
                <Link
                  href={project.project_url}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3CCF91] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#2ba577]"
                >
                  <ExternalLink size={14} />
                  Live Site
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-[#3CCF91]/60 hover:text-[#3CCF91]"
                >
                  <FaGithub size={14} />
                  Source
                </Link>
              )}
            </div>
          </div>
        </div>

        {project.image && (
          <div className="max-w-4xl mx-auto px-6 mt-10 mb-4">
            <Image
              src={project.image}
              alt={project.title}
              width={1400}
              height={700}
              className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/40 object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-10 flex gap-12">
          <div className="min-w-0 flex-1">
            {project.content_sections?.map((section, index) => (
              <section
                key={index}
                id={section.id}
                ref={(el) => { sectionRefs.current[section.title] = el; }}
                className="mb-12 scroll-mt-32"
              >
                <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-bold text-white mb-5">
                  <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-[#3CCF91]" />
                  {section.title}
                </h2>
                {renderSectionContent(section.content)}
              </section>
            ))}
          </div>

          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-32">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                On this page
              </p>
              <ul className="space-y-1 border-l border-white/10">
                {project.content_sections?.map((section, index) => (
                  <li key={index}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(e, section.id)}
                      className={clsx(
                        "-ml-px block border-l-2 pl-4 py-1.5 text-sm transition-colors",
                        activeSection === section.title
                          ? "border-[#3CCF91] text-[#3CCF91] font-medium"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="max-w-3xl mx-auto px-6 pb-24 pt-10 border-t border-white/10">
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle size={18} className="text-[#3CCF91]" />
            <h3 className="text-lg font-semibold">Discussion</h3>
          </div>
          <TextareaForm page={`project/${slug}`} />
        </div>
      </article>
    </>
  );
}

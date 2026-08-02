'use client';

import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TextareaForm } from '@/components/CommentBox';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import BeautifulError from '@/components/BeautifulError';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  content: string | string[];
}

interface BlogDetails {
  title: string;
  description: string;
  image: string;
  blog_id: string;
  content_sections: ContentSection[];
  published_date: string;
  reading_time: string;
}

interface Props {
  initialData: BlogDetails;
  slug: string;
}

export default function BlogDetailsPage({ initialData, slug }: Props) {
  const pathname = usePathname();
  const blogId = pathname?.split('/').pop() || '';
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>('');

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blog');
        return res.json();
      })
      .then((data) => data.blogs[0]);

  const { data: blog, error, isLoading, mutate } = useSWR<BlogDetails>(
    `/api/blog_details?slug=${blogId}`,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 2000,
    }
  );

  const handleRetry = () => {
    mutate();
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!blog) return;
      const sectionElements = Object.entries(sectionRefs.current)
        .filter(([, el]) => el) // Fixed: removed unused parameter '_'
        .map(([title, el]) => ({ title, el: el! }));

      const sorted = sectionElements.sort(
        (a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top
      );

      const DETECTION_OFFSET = 120;
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

      if (isAtBottom) {
        setActiveSection(sorted[sorted.length - 1].title);
        return;
      }

      let active = '';
      for (const section of sorted) {
        const rect = section.el.getBoundingClientRect();
        if (rect.top <= DETECTION_OFFSET) active = section.title;
      }

      setActiveSection(active);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderSectionContent = (content: string | string[] | undefined) => {
    if (!content) return null;
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc marker:text-[#3CCF91] pl-5 space-y-2.5 text-[1.05rem] leading-[1.85] text-gray-300">
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return (
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
          <Skeleton className="h-5 w-full max-w-md mb-1.5" />
          <Skeleton className="h-5 w-2/3 max-w-sm mb-8" />
          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <Skeleton className="w-full h-64 md:h-96 rounded-2xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <BeautifulError
        error={error.message}
        title="Error loading blog"
        description="Could not load the blog. Please try again later."
        onRetry={handleRetry}
        retryText="Try Again"
        backTo="/blogs"
        backText="← Back to Blogs"
        variant="error"
      />
    );
  }

  if (!blog) {
    return (
      <BeautifulError
        title="Blog Not Found"
        description={`The blog "${blogId}" could not be found.`}
        backTo="/blogs"
        backText="← Back to Blogs"
        variant="warning"
      />
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <article className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-8 md:pt-36">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-[#3CCF91] mb-10"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Blogs
          </Link>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-5">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed font-light mb-8">
              {blog.description}
            </p>
          )}

          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3CCF91] to-emerald-700 text-sm font-semibold text-black">
              AG
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium text-gray-200">Ayush Gurung</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500">
                {blog.published_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(blog.published_date)}
                  </span>
                )}
                {blog.reading_time && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} />
                    {blog.reading_time} min read
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {blog.image && (
          <div className="max-w-4xl mx-auto px-6 mt-10 mb-4">
            <Image
              src={blog.image}
              alt={blog.title}
              width={1400}
              height={700}
              className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/40 object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-10 flex gap-12">
          <div className="min-w-0 flex-1">
            {blog.content_sections.map((section, index) => (
              <section
                key={index}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.title] = el;
                }}
                className="mb-12 scroll-mt-32"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">
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
                {blog.content_sections.map((section, index) => (
                  <li key={index}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(e, section.id)}
                      className={clsx(
                        '-ml-px block border-l-2 pl-4 py-1.5 text-sm transition-colors',
                        activeSection === section.title
                          ? 'border-[#3CCF91] text-[#3CCF91] font-medium'
                          : 'border-transparent text-gray-500 hover:text-gray-300'
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
          <TextareaForm page={`blog/${slug}`} />
        </div>
      </article>
    </>
  );
}

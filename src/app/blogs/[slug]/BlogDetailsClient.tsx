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
        <ul className="list-disc pl-5 text-white-400">
          {content.map((item, idx) => (
            <li key={idx} className="mb-2">{item}</li>
          ))}
        </ul>
      );
    }
    return <div className="text-white-300 whitespace-pre-line">{content}</div>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 md:px-20 py-12">
        {/* Skeleton same as before */}
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="w-full h-64 md:h-80 rounded-xl mb-10" />
        <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-5 w-20 mb-10" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
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
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-12 relative">
      <div className="border-b border-[#1E2029] pb-8">
        <Link href="/blogs" className="text-green-400 hover:underline mb-8 inline-block">
          ← Back to Blogs
        </Link>

        <Image 
          src={blog.image} 
          alt={blog.title} 
          width={1200}
          height={600}
          className="w-full rounded-xl mb-10 shadow-xl"
          priority
        />

        <h1 className="text-4xl my-3 font-extrabold flex items-center gap-3">
          {blog.title}
        </h1>

        <p className="my-2 text-sm sm:text-base text-gray-400">{blog.description}</p>

        <div className="flex flex-wrap text-sm text-gray-500 mt-4">
          {blog.published_date && (
            <span className="mr-4">Published: {formatDate(blog.published_date)}</span>
          )}
          {blog.reading_time && <span>{blog.reading_time} min read</span>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mt-10">
        <div className="flex-1">
          {blog.content_sections.map((section, index) => (
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
          ))}
        </div>

        <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 self-start hidden md:block">
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {blog.content_sections.map((section, index) => (
              <li key={index}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={clsx(
                    'hover:text-green-400 text-sm block transition',
                    activeSection === section.title
                      ? 'text-green-500'
                      : 'text-gray-400'
                  )}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="space-y-8">
        <TextareaForm page={`blog/${slug}`} />
      </div>
    </div>
  );
}
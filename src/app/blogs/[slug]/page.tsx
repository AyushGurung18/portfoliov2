import { getBlogDetailsBySlug } from '@/lib/getBlogDetailBySlug';
import BlogDetailsPage from './BlogDetailsClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 1296000

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogDetailsBySlug(slug);
  if (!blog) return { title: 'Not Found' };

  return {
    title: blog.title,
    description: blog.description,
    openGraph: { images: [blog.image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogDetailsBySlug(slug);

  if (!blog) return notFound();

  return <BlogDetailsPage initialData={blog} slug={slug} />;
}
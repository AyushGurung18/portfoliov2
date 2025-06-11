import { getBlogDetailsBySlug } from '@/lib/getBlogDetailBySlug';
import BlogDetailsPage from './BlogDetailsClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export const revalidate = 60 * 60 * 24 * 15; // 15 days

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogDetailsBySlug(params.slug);
  if (!blog) return { title: 'Not Found' };

  return {
    title: blog.title,
    description: blog.description,
    openGraph: { images: [blog.image] },
  };
}

export default async function Page({ params }: Props) {
  const blog = await getBlogDetailsBySlug(params.slug);

  if (!blog) return notFound();

  return <BlogDetailsPage initialData={blog} slug={params.slug} />;
}

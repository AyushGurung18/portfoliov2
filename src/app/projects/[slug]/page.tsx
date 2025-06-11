// page.tsx
import ProjectDetailsPage from './ProjectDetailsClient';
import { getProjectDetailsBySlug } from '@/lib/getProjectDetailBySlug';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 1296000;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  if (!project) return { title: 'Not Found' };

  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [project.image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  if (!project) return notFound();

  return <ProjectDetailsPage initialData={project} slug={slug} />;
}
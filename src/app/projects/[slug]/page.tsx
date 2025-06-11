// page.tsx
import ProjectDetailsPage from './ProjectDetailsClient';
import { getProjectDetailsBySlug } from '@/lib/getProjectDetailBySlug';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export const revalidate = 1296000;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectDetailsBySlug(params.slug);
  if (!project) return { title: 'Not Found' };

  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [project.image] },
  };
}

export default async function Page({ params }: Props) {
  const project = await getProjectDetailsBySlug(params.slug);
  if (!project) return notFound();

  return <ProjectDetailsPage initialData={project} slug={params.slug} />;
}
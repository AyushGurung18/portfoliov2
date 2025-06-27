import ProjectDetailsPage from './ProjectDetailsClient';
import { getProjectDetailsBySlug } from '@/lib/getProjectDetailBySlug';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// ISR revalidation - adjust based on how often your data changes
export const revalidate = 86400; // 24 hours (or whatever works for you)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  
  if (!project) {
    return notFound();
  }

  return <ProjectDetailsPage project={project} slug={slug} />;
}
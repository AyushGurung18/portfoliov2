import ProjectDetailsPage from '../../projects/[slug]/ProjectDetailsClient';
import { getProjectDetailsBySlug } from '@/lib/getProjectDetailBySlug';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// ISR revalidation - 15 days for constant data
export const revalidate = 1296000; // 15 days

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  
  if (!project) {
    return { title: 'Not Found' };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      images: [project.image],
      title: project.title,
      description: project.description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectDetailsBySlug(slug);
  
  if (!project) {
    return notFound();
  }

  // Updated to match the new component props (project instead of initialData)
  return <ProjectDetailsPage project={project} slug={slug} />;
}

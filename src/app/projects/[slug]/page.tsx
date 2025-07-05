import ProjectDetailsPage from './ProjectDetailsClient';
import { getProjectDetailsBySlug } from '@/lib/getProjectDetailBySlug';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // 5 minutes

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const project = await getProjectDetailsBySlug(slug);
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
      };
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  try {
    const project = await getProjectDetailsBySlug(slug);
    if (!project) notFound();
    
    return <ProjectDetailsPage initialData={project} slug={slug} />;
  } catch (error) {
    console.error('Error fetching project details:', error);
    notFound();
  }
}
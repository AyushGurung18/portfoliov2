import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 86400; // Revalidate once a day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ayushgurung.com';

  // Base static routes
  const routes = [
    '',
    '/projects',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Safely try fetching dynamic routes from Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Only run database queries if env vars are present (prevents build crash when missing)
    if (supabaseUrl && supabaseAnonKey) {
      // Fetch blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('title');
      
      const blogRoutes = (blogs || []).map((blog: { title: string }) => {
        const slug = blog.title.toLowerCase().replace(/\s+/g, '-');
        return {
          url: `${baseUrl}/blogs/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('title');

      const projectRoutes = (projects || []).map((project: { title: string }) => {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-');
        return {
          url: `${baseUrl}/projects/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });

      return [...routes, ...blogRoutes, ...projectRoutes];
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap, returning static routes:', error);
  }

  return routes;
}

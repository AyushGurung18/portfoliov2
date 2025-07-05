import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Select id field along with other fields
    const { data: projects, error } = await supabase
      .from('projects')
      .select('title, description, image, technologies, github, slug, created_at')
      .order('created_at', { ascending: false });

      console.log('project' , projects);
      

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const techStack = {
      'React': { color: '#61dafb', text_color: '#61dafb', icon: 'FaReact' },
      'TypeScript': { color: '#3178c6', text_color: '#3178c6', icon: 'SiTypescript' },
      'Node.js': { color: '#339933', text_color: '#339933', icon: 'FaNode' },
      'Next.js': { color: '#2B2C2E', text_color: 'white', icon: 'SiNextdotjs' },
      'Python': { color: '#FBB34C', text_color: '#FBB34C', icon: 'FaPython' },
      'MongoDB': { color: '#47A248', text_color: '#47A248', icon: 'SiMongodb' },
      'Firebase': { color: '#ffca28', text_color: '#ffca28', icon: 'SiFirebase' },
      'Redux': { color: '#764abc', text_color: '#764abc', icon: 'SiRedux' },
      'Vue.js': { color: '#4FC08D', text_color: '#4FC08D', icon: 'FaVuejs' },
      'Express': { color: '#2B2C2E', text_color: 'white', icon: 'SiExpress' },
      'MySQL': { color: '#4479A1', text_color: '#4479A1', icon: 'SiMysql' },
      'Angular': { color: '#DD0031', text_color: '#DD0031', icon: 'FaAngular' },
      'Spring Boot': { color: '#6DB33F', text_color: '#6DB33F', icon: 'SiSpringboot' },
      'PostgreSQL': { color: '#336791', text_color: '#336791', icon: 'SiPostgresql' },
      'Svelte': { color: '#FF3E00', text_color: '#FF3E00', icon: 'SiSvelte' },
      'Django': { color: '#092E20', text_color: '#092E20', icon: 'SiDjango' },
      'SQLite': { color: '#003B57', text_color: '#003B57', icon: 'SiSqlite' }
    };

    const response = NextResponse.json({ projects, techStack });
    
    // Add cache headers
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
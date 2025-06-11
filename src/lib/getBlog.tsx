// lib/getProjects.ts
import { supabase } from '@/lib/supabaseClient';

export async function getBlogs() {
  const { data: blogs, error } = await supabase.from('blogs').select('*');
  if (error) throw new Error(error.message);

  return { blogs };
}

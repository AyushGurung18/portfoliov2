// lib/getBlogDetailsBySlug.ts
import { supabase } from "@/lib/supabaseClient";

export async function getBlogDetailsBySlug(slug: string) {
  const titleFromSlug = slug.split('-').join(' ');

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      summary,
      read_time,
      date,
      blog_details (
        blog_id,
        image,
        content_sections
      )
    `)
    .ilike('title', `%${titleFromSlug}%`)
    .limit(1)
    .single();

  if (error || !data || !data.blog_details) {
    return null;
  }

  return {
    title: data.title,
    description: data.summary,
    blog_id: slug,
    image: data.blog_details[0]?.image || null,
    content_sections: data.blog_details[0]?.content_sections,
    published_date: data.date,
    reading_time: data.read_time,
  };
}

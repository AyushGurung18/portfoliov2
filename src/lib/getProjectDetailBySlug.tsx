import { supabase } from "@/lib/supabaseClient";

export async function getProjectDetailsBySlug(slug: string) {
  const titleFromSlug = slug.split('-').join(' ');

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      image,
      technologies,
      github,
      project_details (
        project_id,
        project_url,
        content_sections
      )
    `)
    .ilike("title", `%${titleFromSlug}%`)
    .limit(1)
    .single();

  if (error || !data || !data.project_details) {
    return null;
  }

  const detail = Array.isArray(data.project_details)
    ? data.project_details[0]
    : data.project_details;

  return {
    title: data.title,
    description: data.description,
    image: data.image,
    project_id: slug,
    content_sections: detail.content_sections || [],
    project_url: detail.project_url,
    technologies: data.technologies || [],
    github: data.github || "",
  };
}
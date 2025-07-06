import { supabase } from "@/lib/supabaseClient";

export async function getProjectDetailsBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        slug,
        title,
        description,
        image,
        technologies,
        github,
        project_details (
          project_url,
          content_sections
        )
      `)
      .eq("slug", slug)
      .single();      

    if (error) throw new Error(error.message);
    if (!data) return null;

    const detail = Array.isArray(data.project_details)
      ? data.project_details[0]
      : data.project_details;

    return {
      title: data.title,
      description: data.description,
      image: data.image,
      project_id: slug,
      content_sections: detail?.content_sections || [],
      project_url: detail?.project_url || '',
      technologies: data.technologies || [],
      github: data.github || "",
    };
  } catch (error) {
    console.error("Error in getProjectDetailsBySlug:", error);
    throw error;
  }
}

// lib/getProjectDetailsBySlug.ts (updated version)
import { supabase } from "@/lib/supabaseClient";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
}

export async function getProjectDetailsBySlug(slug: string) {
  try {    
    // First, get all projects to find the one with matching slug
    const { data: allProjects, error: projectsError } = await supabase
      .from("projects")
      .select('id, title');

    if (projectsError) {
      console.error('Error fetching projects for slug matching:', projectsError);
      throw new Error(`Database error: ${projectsError.message}`);
    }

    if (!allProjects || allProjects.length === 0) {
      console.error('No projects found in database');
      return null;
    }

    // Find the project with matching slug
    const matchingProject = allProjects.find(project => 
      generateSlug(project.title) === slug
    );

    if (!matchingProject) {
      console.error('No project found with slug:', slug);
      return null;
    }

    // Now fetch the full project details using the ID
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
      .eq("id", matchingProject.id)
      .single();

    if (error) {
      console.error('Supabase error fetching project details:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.error('No project data found with ID:', matchingProject.id);
      return null;
    }

    // Handle project_details - it could be null, single object, or array
    let detail = null;
    if (data.project_details) {
      detail = Array.isArray(data.project_details) 
        ? data.project_details[0] 
        : data.project_details;
    }

    const result = {
      title: data.title,
      description: data.description,
      image: data.image,
      project_id: slug, // Use the slug as project_id for consistency
      content_sections: detail?.content_sections || [],
      project_url: detail?.project_url || '',
      technologies: data.technologies || [],
      github: data.github || "",
    };

    return result;
  } catch (error) {
    console.error('Error in getProjectDetailsBySlug:', error);
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
}
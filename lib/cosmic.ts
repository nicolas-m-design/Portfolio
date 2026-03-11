import { createBucketClient } from '@cosmicjs/sdk'
import { AboutMe, WorkExperience, Project } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY || process.env.NEXT_PUBLIC_COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY || process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch about me information from contact object
export async function getAboutMe(): Promise<AboutMe | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'contacts', slug: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const contactObj = response.object;
    
    // Transform contact object to AboutMe format
    const aboutMe: AboutMe = {
      id: contactObj.id,
      slug: contactObj.slug,
      title: 'Nicolas Ménard - About Me',
      content: 'Product Designer with 10+ years of experience building user-centered products. Results-driven and engineering-oriented, with experience conducting user research and leading small design teams.',
      type: 'about-me',
      created_at: contactObj.created_at,
      modified_at: contactObj.modified_at,
      metadata: {
        full_name: contactObj.metadata.full_name || 'Nicolas Ménard',
        professional_title: contactObj.metadata.professional_title || 'Product Designer',
        bio: contactObj.metadata.bio || 'Product Designer with 10+ years of experience building user-centered products. Results-driven and engineering-oriented, with experience conducting user research and leading small design teams.',
        years_experience: contactObj.metadata.years_experience || 8,
        email: contactObj.metadata.email,
        phone: contactObj.metadata.phone,
        location: contactObj.metadata.location,
        linkedin_url: contactObj.metadata.linkedin_url,
        dribbble_url: contactObj.metadata.dribbble_url,
        behance_url: contactObj.metadata.behance_url,
        portfolio_website: contactObj.metadata.portfolio_website,
        available_for_work: contactObj.metadata.available_for_work,
        profile_image: Array.isArray(contactObj.metadata.profile_image) 
          ? contactObj.metadata.profile_image[0] 
          : contactObj.metadata.profile_image || null, // Handle both array and direct value
        resume_cv: contactObj.metadata.resume_cv || contactObj.metadata.resume || null // Handle both field names
      }
    };
    
    return aboutMe;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch about me information');
  }
}

// Fetch all work experience entries
export async function getWorkExperience(): Promise<WorkExperience[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'experiences' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const experiences = response.objects as WorkExperience[];
    
    // Sort by start date (newest first)
    return experiences.sort((a, b) => {
      const dateA = new Date(a.metadata?.start_date || '').getTime();
      const dateB = new Date(b.metadata?.start_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch work experience');
  }
}


// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'works' })
      .props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return response.objects as Project[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch projects');
  }
}

// Fetch single project by slug
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'works', slug })
      .props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return response.object as Project;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch project');
  }
}

// Update work experience entry
export async function updateWorkExperience(id: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
  try {
    const response = await cosmic.objects.updateOne(id, {
      title: data.title,
      slug: data.slug,
      metadata: data.metadata,
    });
    
    return response.object as WorkExperience;
  } catch (error) {
    throw new Error(`Failed to update work experience: ${error}`);
  }
}

// Create new work experience entry
export async function createWorkExperience(data: Omit<WorkExperience, 'id'>): Promise<WorkExperience> {
  try {
    const response = await cosmic.objects.insertOne({
      title: data.title,
      slug: data.slug,
      type: 'work-experience',
      metadata: data.metadata,
    });
    
    return response.object as WorkExperience;
  } catch (error) {
    throw new Error(`Failed to create work experience: ${error}`);
  }
}

// Delete work experience entry
export async function deleteWorkExperience(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    throw new Error(`Failed to delete work experience: ${error}`);
  }
}
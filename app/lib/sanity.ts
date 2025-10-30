// Sanity configuration constants
const SANITY_CONFIG = {
  projectId: 'c248y25j',
  dataset: 'production',
  apiVersion: 'v2023-08-01',
  token: 'skiI9IaA3TVtpDm5JbRdTPmhfXlIm6Yq4JKb2nezuSoUgBGQZSsClON3rNgdUnZoUxAJRbaRkwrR3UYAQQmCrk9I9eI0CM8Z3nT3sHJhICI4EhLhRsGZMPhbQMtNKacOraBRAXu3pdlPWQeikgng0G2sFhdV9ndMz3q39zhu8QzMxkTJLHcD',
};

// GROQ query for hero section (using embraceHero document type)
export const heroSectionQuery = `*[_type == "embraceHero"][0]{
  _id,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  backgroundImage{
    asset->{
      _id,
      url,
      altText,
      metadata {
        dimensions
      }
    }
  },
  image{
    asset->{
      _id,
      url,
      altText,
      metadata {
        dimensions
      }
    }
  }
}`;

export interface HeroSectionData {
  _id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string; // Changed from buttonUrl to buttonLink to match Sanity schema
  backgroundImage?: {
    asset: {
      _id: string;
      url: string;
      altText?: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  };
  image?: {
    asset: {
      _id: string;
      url: string;
      altText?: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

export async function getHeroSectionData(): Promise<HeroSectionData | null> {
  try {
    // Use direct fetch to Sanity API to avoid module compatibility issues
    const query = encodeURIComponent(heroSectionQuery);
    const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${query}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SANITY_CONFIG.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.result || null;
  } catch (error) {
    console.error('Error fetching hero section data:', error);
    return null;
  }
}
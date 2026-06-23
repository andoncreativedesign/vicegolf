import {HttpStatusCode} from 'axios';
import {createAxiosSanity} from '~/utils/axiosInsatances';

// ─── GROQ Queries ───────────────────────────────────────────────

export const allBlogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  publishedAt,
  heroImage {
    asset-> {
      _id,
      url
    },
    alt
  },
  categories[]-> {
    _id,
    title,
    "slug": slug.current
  },
  seoDescription
}`;

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  publishedAt,
  heroImage {
    asset-> {
      _id,
      url
    },
    alt
  },
  categories[]-> {
    _id,
    title,
    "slug": slug.current
  },
  body[] {
    ...,
    _type == "image" => {
      ...,
      asset-> {
        _id,
        url
      }
    }
  },
  seoDescription,
  showDiscoverMore
}`;

export const relatedPostsQuery = `*[_type == "blogPost" && slug.current != $slug && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc) [0...4] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  heroImage {
    asset-> {
      _id,
      url
    },
    alt
  },
  categories[]-> {
    _id,
    title,
    "slug": slug.current
  }
}`;

export const allCategoriesQuery = `*[_type == "blogCategory"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;

// ─── Types ──────────────────────────────────────────────────────

export interface SanityBlogImage {
  asset: {
    _id: string;
    url: string;
  };
  alt?: string;
}

export interface SanityBlogCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt: string;
  heroImage?: SanityBlogImage;
  categories?: SanityBlogCategory[];
  body?: any[];
  seoDescription?: string;
  showDiscoverMore?: boolean;
}

// ─── Fetch Functions ────────────────────────────────────────────

export async function getAllBlogPosts(
  env?: any,
): Promise<SanityBlogPost[]> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(allBlogPostsQuery);
    const response = await axiosSanityInstance.get('/?query=' + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
  env?: any,
): Promise<SanityBlogPost | null> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(blogPostBySlugQuery);
    const params = encodeURIComponent(JSON.stringify({slug}));
    const response = await axiosSanityInstance.get(
      `/?query=${query}&$slug="${slug}"`,
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.result || null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  categoryIds: string[],
  env?: any,
): Promise<SanityBlogPost[]> {
  try {
    if (!categoryIds.length) return [];

    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(relatedPostsQuery);
    const response = await axiosSanityInstance.get(
      `/?query=${query}&$slug="${currentSlug}"&$categoryIds=${encodeURIComponent(JSON.stringify(categoryIds))}`,
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function getAllCategories(
  env?: any,
): Promise<SanityBlogCategory[]> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(allCategoriesQuery);
    const response = await axiosSanityInstance.get('/?query=' + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

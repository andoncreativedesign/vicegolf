// app/lib/sanity/products.ts
import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";

export const productDetailsQuery = (gid: string) => `
  *[_type == "product" && store.gid == "${gid}"][0]{
    _id,
    _type,
    titleProxy,
    slugProxy,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata { dimensions, lqip }
        }
      }
    },
    colorTheme->{
      _id,
      title,
      value
    },
    seo {
      title,
      description,
      image {
        asset->{
          url,
          metadata { dimensions, lqip }
        }
      }
    },

    // === MAIN ACCORDION (existing) ===
    accordionItems[]{
      _key,
      title,
      type,
      description,
      descriptionTitle,
      bulletPoints[]{
        groupTitle,
        items[]{
          customBullet,
          text
        }
      },
      inlinePoints[]{
        title,
        description
      },
      stackedPoints[]{
        title,
        description
      },
      linkPoints[]{
        text,
        url
      },
      titledPoints[]{
        bullet,
        name,
        text
      },
      secondaryDescription
    },

    // === NEW: ACCORDION 2 – Technical Specs Section ===
    accordion2 {
      sectionTitle,
      description,
      sectionImage {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      },
      items[]{
        title,
        description
      }
    },

    productContent1->{
      _id,
      _type,
      content[]{
        title,
        description,
        descriptionType,
        subDescriptions[]{
          _key,
          mainPoint,
          description
        },
        points[],
        images[]{
          alt,
          asset->{
            _id,
            url,
            metadata {
              dimensions,
              lqip
            }
          }
        }
      }
    },
    
    productContent2->{
      _id,
      _type,
      title,
      sections[]{
        images[]{
          asset->{
            _id,
            url,
            metadata {
              lqip,
              dimensions,
              palette
            }
          },
          alt
        },
        contentItems[]{
          title,
          description
        }
      }
    },

    store {
      id,
      gid,
      title,
      slug,
      vendor,
      descriptionHtml,
      previewImageUrl,
      priceRange { minVariantPrice, maxVariantPrice },
      productType,
      status,
      options[],
      variants[]->{
        _id,
        store {
          id,
          title,
          sku,
          price,
          availableForSale,
          image {
            asset->{
              url,
              metadata { dimensions }
            }
          }
        }
      }
    },

    youtubeVideos[0] {
      title,
      description,
      links
    },

    videoContent[0] {
      title,
      description,
      video {
        asset->{
          url,
          metadata { dimensions }
        }
      }
    }
  }
`;

// ==================== TYPES ====================

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number };
  };
}

export interface AccordionItem {
  _key: string;
  title: string;
  type: 'basic' | 'bulletPoints' | 'inlinePoints' | 'linkPoints' | 'descriptionSandwich' | 'stackedPoints' | 'titledPoints';
  description?: string;
  descriptionTitle?: string;
  bulletPoints?: Array<{
    groupTitle?: string;
    items: Array<{ customBullet?: string; text: string }>;
  }>;
  inlinePoints?: Array<{ title: string; description: string }>;
  stackedPoints?: Array<{ title?: string; description: string }>;
  linkPoints?: Array<{ text: string; url: string }>;
  titledPoints?: Array<{
    bullet?: string;
    name: string;
    text: string;
  }>;
  secondaryDescription?: string;
}

// NEW: Accordion2 – Technical Specs
export interface Accordion2Item {
  title: string;
  description: string;
}

export interface Accordion2 {
  sectionTitle: string;
  description?: string;
  sectionImage?: {
    asset: SanityImageAsset;
  };
  items?: Array<{
    title: string;
    description: string;
  }>;
}

export interface SubDescriptionItem {
  _key: string;
  mainPoint: string;
  description: string;
}

export interface ProductContent1Item {
  title?: string;
  description?: string;
  descriptionType?: 'normal' | 'subDescriptions';
  subDescriptions?: SubDescriptionItem[];
  points?: string[];
  images?: Array<{
    alt?: string;
    asset: SanityImageAsset;
  }>;
}

export interface ProductContent1 {
  _id: string;
  _type: string;
  content?: ProductContent1Item[];
}

export interface ProductContent2Section {
  images: Array<{
    asset: SanityImageAsset;
    alt?: string;
  }>;
  contentItems: Array<{
    title: string;
    description: string;
  }>;
}

export interface ProductContent2 {
  _id: string;
  _type: string;
  title: string;
  sections: ProductContent2Section[];
}

export interface StoreVariant {
  _id: string;
  store: {
    id: string;
    title: string;
    sku: string;
    price: number;
    availableForSale: boolean;
    image?: {
      asset: { url: string; metadata: { dimensions: { width: number; height: number } } };
    };
  };
}

export interface StoreProduct {
  id: string;
  gid: string;
  title: string;
  slug: string;
  vendor?: string;
  descriptionHtml?: string;
  previewImageUrl?: string;
  priceRange: {
    minVariantPrice: number;
    maxVariantPrice: number;
  };
  productType?: string;
  status?: string;
  options?: any[];
  variants: StoreVariant[];
  tags?: any[];
  collections?: any[];
}

export interface YoutubeVideo {
  title: string;
  description?: string;
  links: string[];
}

export interface VideoContentItem {
  title?: string;
  description?: string;
  video?: {
    asset: {
      url: string;
      metadata: { dimensions: { width: number; height: number } };
    };
  };
}

export interface ProductDetails {
  _id: string;
  _type: string;
  titleProxy?: string;
  slugProxy?: string;
  body?: any[];
  colorTheme?: {
    _id: string;
    title: string;
    value: string;
  };
  seo?: {
    title?: string;
    description?: string;
    image?: { asset: SanityImageAsset };
  };
  accordionItems?: AccordionItem[];
  accordion2?: Accordion2;                    // ← NEW
  productContent1?: ProductContent1;
  productContent2?: ProductContent2;
  youtubeVideos?: YoutubeVideo;
  videoContent?: VideoContentItem;
  store: StoreProduct;
}

export interface SanityListing {
  _id: string;
  _type: string;
  title: string;
  collectionHandle: string;
  subtitle?: string;
  description?: string;
  images?: Array<{
    _type: string;
    asset: SanityImageAsset;
    alt?: string;
  }>;
  videos?: Array<{
    _type: string;
    asset: SanityImageAsset;
    title?: string;
    description?: string;
  }>;
}

export interface ProductTypeCollection {
  productType: string;
  collectionHandle: string;
}

// ==================== FETCH FUNCTIONS ====================

export async function getProductDetails(id: string): Promise<ProductDetails | null> {
  try {
    const query = productDetailsQuery(id);
    const response = await axiosSanity.post("/", { query });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;
    if (!result) return null;

    return result as ProductDetails;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}


// Get related products based on product tags or collections
export async function getRelatedProducts(productId: string, limit: number = 4): Promise<ProductDetails[]> {
  try {
    // First, get the current product to find related tags/collections
    const currentProduct = await getProductDetails(productId);
    
    if (!currentProduct) {
      return [];
    }

    // Get tags from the current product
    const tags = currentProduct.store?.tags || [];
    const collections = currentProduct.store?.collections?.map(c => c._id) || [];

    // Build a query to find related products
    const query = `
      *[_type == "product" 
        && _id != $productId 
        && (count(store.tags[].value[][@ in $tags]) > 0 || 
            count(store.collections[]._ref[][@ in $collections]) > 0)
      ][0...$limit] {
        _id,
        _type,
        title: store.title,
        slug: store.slug.current,
        store {
          priceRange {
            minVariantPrice,
            maxVariantPrice
          },
          variants[0] {
            price,
            compareAtPrice,
            image {
              asset->{
                _id,
                url
              }
            }
          }
        }
      }
    `;

    const params = {
      productId: currentProduct._id,
      tags,
      collections,
      limit
    };

    const response = await axiosSanity.get(`/query/production?query=${encodeURIComponent(query)}`, { params });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Query to get listing data by collection handle
export const listingQuery = (collectionHandle: string) => `
  *[_type == "listing" && collectionHandle == "${collectionHandle}"][0]{
    _id,
    _type,
    title,
    collectionHandle,
    subtitle,
    description,
    images[]{
      _type,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    videos[]{
      _type,
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      title,
      description
    }
  }
`;

// Get listing data by collection handle
export async function getListingByCollectionHandle(collectionHandle: string): Promise<SanityListing | null> {
  try {
    console.log('🔍 Debug: Fetching listing for collectionHandle:', collectionHandle);
    
    const query = listingQuery(collectionHandle);
    const response = await axiosSanity.post("/", { query });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;
    console.log('🔍 Debug: Sanity result:', result);

    if (!result) {
      console.log('🔍 Debug: No listing found for handle:', collectionHandle);
      return null;
    }

    return result as SanityListing;
  } catch (error) {
    console.error('Error fetching listing details:', error);
    return null;
  }
}

// Debug function to check all listings
export async function getAllListings(): Promise<SanityListing[]> {
  try {
    const query = `
      *[_type == "listing"]{
        _id,
        _type,
        title,
        collectionHandle,
        subtitle,
        description
      }
    `;
    
    const response = await axiosSanity.post("/", { query });
    
    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;
    console.log('🔍 Debug: All listings in Sanity:', result);
    return result || [];
  } catch (error) {
    console.error('Error fetching all listings:', error);
    return [];
  }
}

export async function getProductTypeCollection(identifiers: string[]): Promise<ProductTypeCollection | null> {
  try {
    // Escape strings for GROQ
    const idList = identifiers.map(id => `"${id.replace(/"/g, '\\"')}"`).join(', ');
    const query = `*[_type == "productTypeCollection" && productType in [${idList}]]{
      productType,
      collectionHandle
    }`;
    
    const response = await axiosSanity.post("/", { query });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const matches = response.data.result || [];
    if (matches.length === 0) return null;

    // Return the match that appears earliest in the identifiers array (highest priority)
    return matches.sort((a: ProductTypeCollection, b: ProductTypeCollection) => {
      return identifiers.indexOf(a.productType) - identifiers.indexOf(b.productType);
    })[0];
  } catch (error) {
    console.error('Error fetching product type collection:', error);
    return null;
  }
}

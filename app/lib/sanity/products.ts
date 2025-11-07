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
    
    accordionItems[]{
      _key,
      title,
      description
    },

    productContent1->{
      _id,
      _type,
      content[]{
        title,
        description,
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




// Types for the product details
export interface SanityImageAsset {
  _id: string;
  url: string;
  altText?: string;
}

export interface ColorTheme {
  _id: string;
  title?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  ring?: string;
  background?: string;
  foreground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
}

export interface AccordionItem {
  _key: string;
  title?: string;
  description?: any[]; // Portable Text array
}

export interface ProductContent {
  _id: string;
  title?: string;
  content?: any[]; // Portable Text array
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  shareTitle?: string;
  shareDescription?: string;
  shareGraphic?: {
    asset: SanityImageAsset;
  };
}

export interface ProductVariant {
  _id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  sku?: string;
  barcode?: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: {
    asset: SanityImageAsset;
  };
}

export interface ProductOption {
  _key: string;
  name: string;
  values: string[];
}

export interface StoreProduct {
  _id: string;
  status: 'active' | 'draft' | 'archived';
  isDeleted: boolean;
  title: string;
  slug: {
    current: string;
  };
  descriptionHtml?: string;
  priceRange: {
    minVariantPrice: number;
    maxVariantPrice: number;
  };
  variants: ProductVariant[];
  options: ProductOption[];
  images: {
    asset: SanityImageAsset;
  }[];
  tags: string[];
  collections: {
    _id: string;
    title: string;
    handle: string;
  }[];
}

export interface SanityImage {
  _id: string;
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string;
    palette?: any;
  };
}

export interface BlockContent {
  _type: string;
  [key: string]: any;
}

export interface SanityImage {
  _id: string;
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string;
  };
}

export interface ProductContent1Item {
  title?: string;
  description?: string;
  points?: string[];
  images?: Array<{
    alt?: string;
    asset: SanityImage;
  }>;
}

export interface ProductContent1 {
  _id: string;
  _type: string;
  content?: ProductContent1Item[];
}

export interface ProductContent2Section {
  images: Array<{
    asset: SanityImage;
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
      asset: {
        url: string;
        metadata: {
          dimensions: {
            width: number;
            height: number;
            aspectRatio: number;
          };
        };
      };
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
}

export interface YoutubeVideo {
  title: string;
  description?: string;
  links: string[];
}

export interface SanityVideoAsset {
  _type: 'sanity.fileAsset';
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface VideoContentItem {
  _key?: string;
  title?: string;
  description?: string;
  video?: {
    asset: SanityVideoAsset;
  };
}

export interface ProductDetails {
  _id: string;
  _type: string;
  titleProxy?: string;
  slugProxy?: string;
  body?: BlockContent[];
  colorTheme?: {
    _id: string;
    title: string;
    value: string;
  };
  seo?: {
    title?: string;
    description?: string;
    image?: {
      asset: SanityImage;
    };
  };
  accordionItems?: Array<{
    _key: string;
    title: string;
    description: string;
  }>;
  productContent1?: ProductContent1;
  productContent2?: ProductContent2;
  youtubeVideos?: YoutubeVideo;
  videoContent?: VideoContentItem;
  store: StoreProduct;
}

export async function getProductDetails(id: string): Promise<ProductDetails | null> {
  try {
    const query = productDetailsQuery(id);
    const response = await axiosSanity.post("/", { query });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;

    if (!result) {
      return null;
    }

    return result as ProductDetails;
  } catch (error) {
    console.error('Error fetching product details:', error);
    console.log(JSON.stringify(error))
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
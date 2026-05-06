import { HttpStatusCode } from "axios";
import { createAxiosSanity } from "~/utils/axiosInsatances";

// GraphQL query for home page data
// GraphQL query for critical home page data (Hero sections)
export const homePageHeroQuery = `*[_type == "home"][0]{
  banner {
    enabled,
    backgroundColor,
    textColor,
    content
  },
  heroes[] {
    title {
      text,
      color
    },
    text2 {
      text,
      color
    },
    description,
    buttonText,
    handle,
    content[0]{
      image{
        asset->{
          _id,
          url
        }
      }
    },
    mobileContent[0]{
      image{
        asset->{
          _id,
          url
        }
      }
    },
  },
  brand[] {
    name,
    logo{
      asset->{
        _id,
        url
      }
    },
    url
  }
}`;

// GraphQL query for non-critical home page data (Lower sections)
export const homePageLowerSectionsQuery = `*[_type == "home"][0]{
  secondaryHero[] {
    title {
      text,
      color
    },
    text2 {
      text,
      color
    },
    description {
      text,
      color
    },
    handle,
    buttonText,
    buttonLink,
    backgroundImage{
      asset->{
        _id,
        url
      }
    },
    mobileBackgroundImage{
      asset->{
        _id,
        url
      }
    }
  },
  homeCategories[] {
    title,
    description,
    image{
      asset->{
        _id,
        url
      }
    },
  },
}`;

export const homePageViceLookQuery = `*[_type == "home"][0]{
  viceLook {
    title,
    items[] {
      title,
      url,
      image {
        asset->{
          _id,
          url
        }
      },
      tooltips[] {
        _key,
        x,
        y,
        linkTitle,
        collectionHandle,
        product->{
          store {
            title,
            slug,
            priceRange {
              minVariantPrice
            },
            productType
          }
        }
      }
    }
  }
}`;

// Types for the home page data
export interface SanityImageAsset {
  _id: string;
  url: string;
  altText?: string;
}

export interface HeroContentImage {
  image: { asset: SanityImageAsset; };
}

export interface HeroItem {
  title?: string;
  text2?: string;
  description?: string;
  buttonText?: string;
  content?: HeroContentImage[];
}

export interface SecondaryHeroItem {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: { asset: SanityImageAsset; };
}

export interface BrandItem {
  name: string;
  logo?: { asset: SanityImageAsset; };
  url?: string;
}

export interface HeroItemTransformed {
  title?: { text?: any[]; color?: string; };
  text2?: { text?: any[]; color?: string; };
  description?: { text?: any[]; color?: string; };
  buttonText?: { text?: string; textColor?: string; backgroundColor?: string; };
  image?: string;
  mobileImage?: string;
  handle: string;
  _key?: string; // Added for array items
}

export interface BrandItemTransformed {
  name: string;
  logo?: string;
  url?: string;
}

export interface HomeCategories {
  title: string;
  image: string;
  description?: string;
}

export interface ShippingPoint {
  _key: string;
  pointType: 'simple' | 'detailed';
  simplePoint?: string;
  pointTitle?: string;
  pointDescription?: string;
  showBullet?: boolean;
}

export interface ShippingDetails {
  _id: string;
  _type: string;
  title?: string;
  contentType?: string;
  description?: string;
  points?: ShippingPoint[];
}

export interface ViceLookTooltip {
  _key: string;
  x: number;
  y: number;
  linkTitle?: string;
  title?: string;
  collectionHandle?: string;
  product?: {
    store: {
      title: string;
      slug: { current: string };
      priceRange: { minVariantPrice: number; };
      productType?: string;
    }
  }
}

export interface ViceLookItem {
  title: string;
  url?: string;
  image: string;
  tooltips: ViceLookTooltip[];
}

export interface ViceLookSectionData {
  title: string;
  items: ViceLookItem[];
}

export interface BannerData {
  enabled: boolean;
  backgroundColor: string;
  textColor: string;
  content: Array<{
    _key: string;
    _type: string;
    children: Array<{
      _key: string;
      _type: string;
      marks: string[];
      text: string;
    }>;
    markDefs: any[];
    style: string;
  }>;
}

export interface HomePageHeroData {
  banner?: BannerData;
  heroes?: HeroItemTransformed[];
  brand?: BrandItemTransformed[];
}

export interface HomePageSectionData {
  secondaryHero?: HeroItemTransformed[];
  homeCategories: HomeCategories[];
}

export interface HomePageViceLookData {
  viceLook?: ViceLookSectionData;
}

// Update the getHeroSectionData function to use the new query
export async function getHomePageHeroData(env?: any): Promise<HomePageHeroData | null> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(homePageHeroQuery);
    const response = await axiosSanityInstance.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;

    const transformedData: HomePageHeroData = {
      banner: result.banner,
      heroes: result.heroes?.map((hero: any) => ({
        title: hero.title,
        text2: hero.text2,
        description: hero.description,
        buttonText: hero.buttonText,
        handle: hero.handle,
        image: hero.content?.image?.asset?.url,
        mobileImage: hero.mobileContent?.image?.asset?.url
      })),
      brand: result.brand?.map((brand: any) => ({
        name: brand.name as string,
        logo: brand.logo?.asset?.url as string,
        url: brand.url
      })),
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching home page hero data:', error);
    return null;
  }
}

export async function getHomePageSectionData(env?: any): Promise<HomePageSectionData | null> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(homePageLowerSectionsQuery);
    const response = await axiosSanityInstance.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;

    const transformedData: HomePageSectionData = {
      secondaryHero: result.secondaryHero?.map((hero: any) => ({
        title: hero.title,
        text2: hero.text2,
        description: hero.description,
        buttonText: hero.buttonText,
        handle: hero.buttonLink || hero.handle,
        image: hero.backgroundImage?.asset?.url,
        mobileImage: hero.mobileBackgroundImage?.asset?.url
      })),
      homeCategories: result.homeCategories?.map((category: any) => ({
        title: category.title as string,
        image: category.image?.asset?.url as string,
        description: category?.description
      })),
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching home page section data:', error);
    return null;
  }
}

export async function getHomePageViceLookData(env?: any): Promise<HomePageViceLookData | null> {
  try {
    console.log("Fetching ViceLook...");
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(homePageViceLookQuery);
    const response = await axiosSanityInstance.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data.result;

    const transformedData: HomePageViceLookData = {
      viceLook: result.viceLook ? {
        title: result.viceLook.title,
        items: result.viceLook.items?.map((item: any) => ({
          title: item.title,
          url: item.url,
          image: item.image?.asset?.url,
          tooltips: item.tooltips?.map((tooltip: any) => ({
            _key: tooltip._key,
            x: tooltip.x,
            y: tooltip.y,
            linkTitle: tooltip.linkTitle,
            collectionHandle: tooltip.collectionHandle,
            title: tooltip.product?.store?.title || tooltip.linkTitle,
            product: tooltip.product ? {
              store: {
                title: tooltip.product.store.title,
                slug: tooltip.product.store.slug,
                priceRange: tooltip.product.store.priceRange,
                productType: tooltip.product.store.productType
              }
            } : undefined
          }))
        }))
      } : undefined,
    };

    console.log("ViceLook success");
    return transformedData;
  } catch (error) {
    console.error('Error fetching home page vice look data:', error);
    return null;
  }
}

export const shippingDetailsQuery = `*[_type == "home"][0]{
  shippingDetails {
    _id,
    _type,
    title,
    contentType,
    description,
    points[] {
      _key,
      pointType,
      simplePoint,
      pointTitle,
      pointDescription,
      showBullet
    }
  }
}`;

export async function getShippingDetails(env?: any): Promise<ShippingDetails | null> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    const query = encodeURIComponent(shippingDetailsQuery);
    const response = await axiosSanityInstance.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data;

    // Return the shipping details directly since that's all we're querying for
    return result.result?.shippingDetails || null;

  } catch (error) {
    console.error('Error fetching shipping details:', error);
    return null;
  }
}
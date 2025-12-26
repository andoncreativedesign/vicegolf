import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";


// GraphQL query for home page data
export const homePageQuery = `*[_type == "home"][0]{
    heroes[] {
      title,
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

    secondaryHero[] {
      title,
      description,
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

    brand[] {
      name,
      logo{
        asset->{
          _id,
          url
        }
      },
      url
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

    shippingDetails {
      _id,
      _type,
      title,
      contentType,
      description,
      points[] {
        _key,
        point
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
  image: {
    asset: SanityImageAsset;
  };
}

export interface HeroItem {
  title?: string;
  description?: string;
  buttonText?: string;
  content?: HeroContentImage[];
}

export interface SecondaryHeroItem {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: {
    asset: SanityImageAsset;
  };
}

export interface BrandItem {
  name: string;
  logo?: {
    asset: SanityImageAsset;
  };
  url?: string;
}

export interface HeroItemTransformed {
  title?: string;
  description?: string;
  buttonText?: string;
  image?: string;
  mobileImage?: string;
  handle: string;
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
  point: string;
}
export interface ShippingDetails {
  _id: string;
  _type: string;
  title?: string;
  contentType?: string;
  description?: string;
  points?: ShippingPoint[];
}

export interface HomePageData {
  heroes?: HeroContentImage[];
  secondaryHero?: HeroContentImage[];
  brand?: BrandItemTransformed[];
}

export interface HomePageDataTransformed {
  heroes?: HeroItemTransformed[];
  secondaryHero?: HeroItemTransformed[];
  brand?: BrandItemTransformed[];
  homeCategories: HomeCategories[]
}

// Update the getHeroSectionData function to use the new query
export async function getHomePageData(): Promise<HomePageDataTransformed | null> {
  try {
    const query = encodeURIComponent(homePageQuery);
    const response = await axiosSanity.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data;

    // Transform the data to match our types
    const transformedData: HomePageDataTransformed = {
      heroes: result.result.heroes?.map((hero: any) => ({
        title: hero.title,
        description: hero.description,
        buttonText: hero.buttonText,
        handle: hero.handle,
        image: hero.content?.image?.asset?.url,
        mobileImage: hero.mobileContent?.image?.asset?.url
      })),
      secondaryHero: result.result.secondaryHero?.map((hero: any) => ({
        title: hero.title,
        description: hero.description,
        buttonText: hero.buttonText,
        handle: hero.buttonLink || hero.handle,
        image: hero.backgroundImage?.asset?.url,
        mobileImage: hero.mobileBackgroundImage?.asset?.url
      })),
      brand: result.result.brand?.map((brand: any) => ({
        name: brand.name as string,
        logo: brand.logo?.asset?.url as string,
        url: brand.url
      })),
      homeCategories: result.result.homeCategories?.map((category: any) => ({
        title: category.title as string,
        image: category.image?.asset?.url as string,
        description: category?.description
      })),
    };

    // console.log("transformedData")
    // console.log(JSON.stringify(transformedData?.homeCategories?.[0]))
    // console.log('secondaryHero')
    // console.log(JSON.stringify(transformedData?.secondaryHero?.length))
    // console.log('brand')
    // console.log(JSON.stringify(transformedData?.brand?.[0]))

    return transformedData;
  } catch (error) {
    console.error('Error fetching home page data:', error);
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
      point
    }
  }
}`;

export async function getShippingDetails(): Promise<ShippingDetails | null> {
  try {
    const query = encodeURIComponent(shippingDetailsQuery);
    const response = await axiosSanity.get("/?query=" + query);

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
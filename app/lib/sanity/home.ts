import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";


// GraphQL query for home page data
export const homePageQuery = `*[_type == "home"][0]{
    heroes[] {
      title,
      description,
      handle,
      content[0]{
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
      buttonLink,
      backgroundImage{
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
  image?: string
  handle: string
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

    console.log("\n\nresponse.data.result")
    console.log(response.data.result.homeCategories)

    // Transform the data to match our types
    const transformedData: HomePageDataTransformed = {
      heroes: result.result.heroes?.map((hero: any) => ({
        title: hero.title,
        description: hero.description,
        handle: hero.handle,
        image: hero.content?.image?.asset?.url
      })),
      secondaryHero: result.result.secondaryHero?.map((hero: any) => ({
        title: hero.title,
        description: hero.description,
        buttonText: hero.buttonText,
        handle: hero.handle,
        image: hero.backgroundImage?.asset?.url,
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
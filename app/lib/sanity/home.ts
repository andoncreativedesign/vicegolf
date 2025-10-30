import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";


// GraphQL query for home page data
export const homePageQuery = `*[_type == "home"][0]{
    heroes[] {
      title,
      description,
      buttonText,
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
      buttonText,
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
}


export interface BrandItemTransformed {
  name: string;
  logo?: string;
  url?: string;
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
}

// Update the getHeroSectionData function to use the new query
export async function getHomePageData(): Promise<HomePageDataTransformed | null> {
  console.log('get Homepage data call --')
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
        image: hero.content?.image?.asset?.url
      })),
      secondaryHero: result.result.secondaryHero?.map((hero: any) => ({
        title: hero.title,
        description: hero.description,
        buttonText: hero.buttonText,
        buttonLink: hero.buttonLink,
        image: hero.backgroundImage?.asset?.url,
      })),
      brand: result.result.brand?.map((brand: any) => ({
        name: brand.name as string,
        logo: brand.logo?.asset?.url as string,
        url: brand.url
      })),
    };

    console.log("transformedData")
    console.log(JSON.stringify(transformedData?.heroes?.[0]))
    console.log('secondaryHero')
    console.log(JSON.stringify(transformedData?.secondaryHero?.length))
    console.log('brand')
    console.log(JSON.stringify(transformedData?.brand?.[0]))

    return transformedData;
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return null;
  }
}
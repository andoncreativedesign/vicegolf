// Sanity configuration constants
const SANITY_CONFIG = {
  projectId: 'c248y25j',
  dataset: 'production',
  apiVersion: 'v2023-08-01',
  token: 'skiI9IaA3TVtpDm5JbRdTPmhfXlIm6Yq4JKb2nezuSoUgBGQZSsClON3rNgdUnZoUxAJRbaRkwrR3UYAQQmCrk9I9eI0CM8Z3nT3sHJhICI4EhLhRsGZMPhbQMtNKacOraBRAXu3pdlPWQeikgng0G2sFhdV9ndMz3q39zhu8QzMxkTJLHcD',
};

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

export interface HomePageDataTransformed{
  heroes?: HeroItemTransformed[];
  secondaryHero?: HeroItemTransformed[];
  brand?: BrandItemTransformed[];
}

// Update the getHeroSectionData function to use the new query
export async function getHomePageData(): Promise<HomePageDataTransformed | null> {
  console.log('get Homepage data call --')
  try {
    const query = encodeURIComponent(homePageQuery);
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

    const result = await response.json<{ result: HomePageData }>();

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
      brand:[{
        name: result.result?.brand?.[0].name,
        logo: result.result?.brand?.[0].logo?.asset?.url,
        url: result.result?.brand?.[0].url
      }]
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
// app\routes\($locale)._index.tsx
import { Await, useLoaderData, Link, useRouteLoaderData, useFetcher } from 'react-router';
import type { ActionFunctionArgs } from '@shopify/remix-oxygen';
import { getDiscount } from '~/utils/discounts.server';
import type { Route } from './+types/_index';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { Image } from '@shopify/hydrogen';
import type { FeaturedCollectionFragment, RecommendedProductsQuery } from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { HeroSection } from '~/components/HeroSection';
import { ProductGrid } from '~/components/ProductGrid';
import { getHomePageHeroData, getHomePageSectionData, getHomePageViceLookData } from '~/lib/sanity/home';
import {
  ADMIN_PRODUCTS_BY_FAMILY,
  ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD,
  createCategoryQuery,
  RECOMMENDED_PRODUCTS_QUERY,
  type MenuData,
} from '~/lib/shopify/product-queries';
import ClientLogos from '~/components/Home/ClientLogos';
import ShopByCategories from '~/components/Home/ShopByCategories';
import { ViceLookSection } from '~/components/Home/ViceLookSection';
import type { MenuItem } from '~/lib/shopify/product-queries';
import {
  FAMILY_GROUP_QUERY,
  FEATURED_COLLECTION_QUERY,
  MULTIPLE_COLLECTIONS_QUERY
} from '~/lib/shopify/collection-queries';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { loadFamilyData } from '~/utils/loadFamilyData';


export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  const url = data?.url || '';
  const title = 'Vice Golf Official Store | Premium Golf Gear';
  const description =
    'Discover premium golf balls, apparel, and accessories at Vice Golf. Engineered for performance, designed for style.';

  // Determine the best image: Hero > Brand Logo > Fallback Logo
  const heroImage = data?.homePageHeroData?.heroes?.[0]?.image;
  const brandLogo = data?.homePageHeroData?.brand?.[0]?.logo;
  const logoFallback =
    'https://cdn.shopify.com/s/files/1/0732/0505/5640/files/vice_logo_extra_padding.png?v=1776675749&width=1200&height=630';

  let ogImage = logoFallback || brandLogo || heroImage;

  if (ogImage && ogImage.startsWith('//')) {
    ogImage = `https:${ogImage}`;
  }

  const metaTags: any[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:site_name', content: 'Vice Golf' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:secure_url', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Vice Golf' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ];

  if (url) {
    metaTags.push({
      rel: 'canonical',
      href: url,
    });
  }

  return metaTags;
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalDataWithFamilies = await loadCriticalData(args);
  const { families, ...criticalData } = criticalDataWithFamilies;
  const familyData = loadFamilyData(families);
  const homePageHeroData = await getHomePageHeroData(args.context.env);
  const homePageSectionData = await getHomePageSectionData(args.context.env);
  const homePageViceLookData = await getHomePageViceLookData(args.context.env);
  return { ...deferredData, ...criticalData, homePageHeroData, homePageSectionData, homePageViceLookData, familyData, url: args.request.url };
}
export async function action({ request, context }: ActionFunctionArgs) {
  console.log('Action triggered on Homepage');
  const formData = await request.formData();
  const code = formData.get('code');
  console.log('Code from formData:', code);

  if (!code) return { discount: null };

  const { env } = context;
  const discount = await getDiscount(code.toString(), env);
  console.log('Discount found:', discount);
  return { discount };
}



async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const golfBallsCursor = url.searchParams.get('golfBallsCursor') || null;
  const golfClubsCursor = url.searchParams.get('golfClubsCursor') || null;
  const apparelCursor = url.searchParams.get('apparelCursor') || null;
  const gearCursor = url.searchParams.get('gearCursor') || null;

  // 1️⃣ Fetch main data
  const [collectionsData, categoryProducts] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(MULTIPLE_COLLECTIONS_QUERY, {
      variables: {
        golfBallsHandle: createCategoryQuery('golf-balls'),
        golfBallsCursor,
        golfClubsHandle: createCategoryQuery('golf-clubs'),
        golfClubsCursor,
        apparelHandle: createCategoryQuery('apparel'),
        apparelCursor,
        gearHandle: createCategoryQuery(''),
        gearCursor,
        limitedEditionsHandle: createCategoryQuery(''),
        fittingCustomisationHandle: createCategoryQuery(''),
        juniorsHandle: createCategoryQuery(''),
        first: 15,
      },
    }),
  ]);

  // 2️⃣ Extract products from ALL categories that include family metafields
  const allProducts = [
    ...(categoryProducts?.golfBalls?.products?.nodes || []),
    ...(categoryProducts?.golfClubs?.products?.nodes || []),
    ...(categoryProducts?.apparel?.products?.nodes || []),
    ...(categoryProducts?.gear?.products?.nodes || []),
  ];

  // 3️⃣ Extract unique family values
  const families = [
    ...new Set(allProducts.map(p => p.family?.value).filter(Boolean)),
  ];

  const updateNodes = (category: any) => {
    const products = category?.products?.nodes || [];
    const pageInfo = category?.products?.pageInfo;
    return {
      ...category,
      nodes: products,
      pageInfo
    };
  };

  // Update each category with null checks
  if (categoryProducts) {
    categoryProducts.golfBalls = updateNodes(categoryProducts.golfBalls || {});
    categoryProducts.golfClubs = updateNodes(categoryProducts.golfClubs || {});
    categoryProducts.apparel = updateNodes(categoryProducts.apparel || {});
    categoryProducts.gear = updateNodes(categoryProducts.gear || {});
  }

  // 7️⃣ Return final combined output
  return {
    featuredCollection: collectionsData.collections.nodes[0],
    categoryProducts,
    golfBallsPageInfo: categoryProducts.golfBalls.pageInfo,
    golfClubsPageInfo: categoryProducts.golfClubs.pageInfo,
    apparelPageInfo: categoryProducts.apparel.pageInfo,
    gearPageInfo: categoryProducts.gear.pageInfo,
    currentGolfBallsCursor: golfBallsCursor,
    currentGolfClubsCursor: golfClubsCursor,
    currentApparelCursor: apparelCursor,
    currentGearCursor: gearCursor,
    productsForNav: context.productsForNav,
    families,
  };
}


async function loadDeferredData({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const recommendedCursor = url.searchParams.get('recommendedCursor') || null;
  const recommendedProducts = await context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        first: 15,
        after: recommendedCursor,
      },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
  return {
    recommendedProducts,
    currentRecommendedCursor: recommendedCursor,
    recommendedPageInfo: recommendedProducts?.products?.pageInfo,
  };
}

export default function Homepage({ loaderData: data }: Route.ComponentProps) {
  const rootData = useRouteLoaderData<{ productsForNav: MenuData }>('root');
  const fetcher = useFetcher();
  const discountFetcher = useFetcher<any>();
  const [sessionDiscount, setSessionDiscount] = useState<any>(null);
  const productsForNav = rootData?.productsForNav;
  const [menu, setMenu] = useState<MenuItem[]>([]);
  // Golf Balls State
  const [golfBalls, setGolfBalls] = useState<any[]>([]);
  const [currentGolfBallsCursor, setCurrentGolfBallsCursor] = useState<string | null>(null);
  const [hasMoreGolfBalls, setHasMoreGolfBalls] = useState(false);
  const [isLoadingGolfBalls, setIsLoadingGolfBalls] = useState(false);
  // Golf Clubs State
  const [golfClubs, setGolfClubs] = useState<any[]>([]);
  const [currentGolfClubsCursor, setCurrentGolfClubsCursor] = useState<string | null>(null);
  const [hasMoreGolfClubs, setHasMoreGolfClubs] = useState(false);
  const [isLoadingGolfClubs, setIsLoadingGolfClubs] = useState(false);
  // Apparel State
  const [apparelProducts, setApparelProducts] = useState<any[]>([]);
  const [currentApparelCursor, setCurrentApparelCursor] = useState<string | null>(null);
  const [hasMoreApparel, setHasMoreApparel] = useState(false);
  const [isLoadingApparel, setIsLoadingApparel] = useState(false);
  // Gear State
  const [gearProducts, setGearProducts] = useState<any[]>([]);
  const [currentGearCursor, setCurrentGearCursor] = useState<string | null>(null);
  const [hasMoreGear, setHasMoreGear] = useState(false);
  const [isLoadingGear, setIsLoadingGear] = useState(false);
  // Recommended Products State
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [currentRecommendedCursor, setCurrentRecommendedCursor] = useState<string | null>(null);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(false);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);

  useEffect(() => {
    const code = sessionStorage.getItem('featuredDiscountCode');
    if (code && !discountFetcher.data && discountFetcher.state === 'idle') {
      discountFetcher.submit({ code }, { method: 'post', action: '.' });
    }
  }, []);

  useEffect(() => {
    if (discountFetcher.data?.discount) {
      setSessionDiscount(discountFetcher.data.discount);
    }
  }, [discountFetcher.data]);

  // === Golf Balls: Initial Load & Pagination ===
  useEffect(() => {
    if (data.categoryProducts?.golfBalls?.nodes) {
      if (data.currentGolfBallsCursor) {
        setGolfBalls((prev) => [...prev, ...data.categoryProducts.golfBalls.nodes]);
      } else {
        setGolfBalls(data.categoryProducts.golfBalls.nodes);
      }
      setCurrentGolfBallsCursor(data.golfBallsPageInfo?.endCursor || null);
      setHasMoreGolfBalls(!!data.golfBallsPageInfo?.hasNextPage);
    }
  }, [data.categoryProducts?.golfBalls, data.currentGolfBallsCursor, data.golfBallsPageInfo]);

  // === Golf Clubs: Initial Load & Pagination ===
  useEffect(() => {
    if (data.categoryProducts?.golfClubs?.nodes) {
      if (data.currentGolfClubsCursor) {
        setGolfClubs((prev) => [...prev, ...data.categoryProducts.golfClubs.nodes]);
      } else {
        setGolfClubs(data.categoryProducts.golfClubs.nodes);
      }
      setCurrentGolfClubsCursor(data.golfClubsPageInfo?.endCursor || null);
      setHasMoreGolfClubs(!!data.golfClubsPageInfo?.hasNextPage);
    }
  }, [data.categoryProducts?.golfClubs, data.currentGolfClubsCursor, data.golfClubsPageInfo]);

  // === Apparel: Initial Load & Pagination ===
  useEffect(() => {
    if (data.categoryProducts?.apparel?.nodes) {
      if (data.currentApparelCursor) {
        setApparelProducts((prev) => [...prev, ...data.categoryProducts.apparel.nodes]);
      } else {
        setApparelProducts(data.categoryProducts.apparel.nodes);
      }
      setCurrentApparelCursor(data.apparelPageInfo?.endCursor || null);
      setHasMoreApparel(!!data.apparelPageInfo?.hasNextPage);
    }
  }, [data.categoryProducts?.apparel, data.currentApparelCursor, data.apparelPageInfo]);

  // === Gear: Initial Load ===
  useEffect(() => {
    if (data.categoryProducts?.gear?.nodes) {
      if (data.currentGearCursor) {
        setGearProducts((prev) => [...prev, ...data.categoryProducts.gear.nodes]);
      } else {
        setGearProducts(data.categoryProducts.gear.nodes);
      }
      setCurrentGearCursor(data.gearPageInfo?.endCursor || null);
      setHasMoreGear(!!data.gearPageInfo?.hasNextPage);
    }
  }, [data.categoryProducts?.gear, data.currentGearCursor, data.gearPageInfo]);

  // === Recommended Products: Initial Load & Pagination ===
  useEffect(() => {
    if (data.recommendedProducts?.products?.nodes) {
      if (data.currentRecommendedCursor) {
        setRecommendedProducts((prev) => [...prev, ...data.recommendedProducts.products.nodes]);
      } else {
        setRecommendedProducts(data.recommendedProducts.products.nodes);
      }
      setCurrentRecommendedCursor(data.recommendedPageInfo?.endCursor || null);
      setHasMoreRecommended(!!data.recommendedPageInfo?.hasNextPage);
    }
  }, [data.recommendedProducts, data.currentRecommendedCursor, data.recommendedPageInfo]);

  // === Synchronize family variants when they load ===
  useEffect(() => {
    if (!data.familyData) return;

    data.familyData.then((familyGroups: any) => {
      const mergeFamilies = (prevProducts: any[]) => {
        return prevProducts.map(p => {
          const familyValue = p?.family?.value;
          if (familyValue && familyGroups[familyValue]) {
            return {
              ...p,
              variantFamilyProducts: familyGroups[familyValue]
            };
          }
          return p;
        });
      };

      setGolfBalls(prev => mergeFamilies(prev));
      setGolfClubs(prev => mergeFamilies(prev));
      setApparelProducts(prev => mergeFamilies(prev));
      setGearProducts(prev => mergeFamilies(prev));
    });
  }, [data.familyData]);

  // === Handle fetcher for all sections ===
  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    // Handle category products
    const newCategoryData = fetcher.data.categoryProducts;
    if (newCategoryData) {
      // Golf Balls Load More
      if (newCategoryData.golfBalls?.nodes?.length > 0 && fetcher.data.currentGolfBallsCursor) {
        setGolfBalls((prev) => [...prev, ...newCategoryData.golfBalls.nodes]);
        setCurrentGolfBallsCursor(newCategoryData.golfBalls.pageInfo?.endCursor || null);
        setHasMoreGolfBalls(!!newCategoryData.golfBalls.pageInfo?.hasNextPage);
        setIsLoadingGolfBalls(false);
      }
      // Golf Clubs Load More
      if (newCategoryData.golfClubs?.nodes?.length > 0 && fetcher.data.currentGolfClubsCursor) {
        setGolfClubs((prev) => [...prev, ...newCategoryData.golfClubs.nodes]);
        setCurrentGolfClubsCursor(newCategoryData.golfClubs.pageInfo?.endCursor || null);
        setHasMoreGolfClubs(!!newCategoryData.golfClubs.pageInfo?.hasNextPage);
        setIsLoadingGolfClubs(false);
      }
      // Apparel Load More
      if (newCategoryData.apparel?.nodes?.length > 0 && fetcher.data.currentApparelCursor) {
        setApparelProducts((prev) => [...prev, ...newCategoryData.apparel.nodes]);
        setCurrentApparelCursor(newCategoryData.apparel.pageInfo?.endCursor || null);
        setHasMoreApparel(!!newCategoryData.apparel.pageInfo?.hasNextPage);
        setIsLoadingApparel(false);
      }
      // Gear Load More
      if (newCategoryData.gear?.nodes?.length > 0 && fetcher.data.currentGearCursor) {
        setGearProducts((prev) => [...prev, ...newCategoryData.gear.nodes]);
        setCurrentGearCursor(newCategoryData.gear.pageInfo?.endCursor || null);
        setHasMoreGear(!!newCategoryData.gear.pageInfo?.hasNextPage);
        setIsLoadingGear(false);
      }
    }
    // Handle recommended products
    const newRecommendedData = fetcher.data.recommendedProducts;
    if (newRecommendedData?.products?.nodes?.length > 0 && fetcher.data.currentRecommendedCursor) {
      setRecommendedProducts((prev) => [...prev, ...newRecommendedData.products.nodes]);
      setCurrentRecommendedCursor(newRecommendedData.products.pageInfo?.endCursor || null);
      setHasMoreRecommended(!!newRecommendedData.products.pageInfo?.hasNextPage);
      setIsLoadingRecommended(false);
    }
  }, [fetcher.state, fetcher.data]);
  // === Load More Handlers ===

  const handleLoadMoreGolfBalls = useCallback(() => {
    if (!currentGolfBallsCursor || !hasMoreGolfBalls || isLoadingGolfBalls) return;
    setIsLoadingGolfBalls(true);
    fetcher.submit(
      { golfBallsCursor: currentGolfBallsCursor },
      { method: 'get', action: '.' }
    );
  }, [currentGolfBallsCursor, hasMoreGolfBalls, isLoadingGolfBalls, fetcher]);

  const handleLoadMoreGolfClubs = useCallback(() => {
    if (!currentGolfClubsCursor || !hasMoreGolfClubs || isLoadingGolfClubs) return;
    setIsLoadingGolfClubs(true);
    fetcher.submit(
      { golfClubsCursor: currentGolfClubsCursor },
      { method: 'get', action: '.' }
    );
  }, [currentGolfClubsCursor, hasMoreGolfClubs, isLoadingGolfClubs, fetcher]);

  const handleLoadMoreApparel = useCallback(() => {
    if (!currentApparelCursor || !hasMoreApparel || isLoadingApparel) return;
    setIsLoadingApparel(true);
    fetcher.submit(
      { apparelCursor: currentApparelCursor },
      { method: 'get', action: '.' }
    );
  }, [currentApparelCursor, hasMoreApparel, isLoadingApparel, fetcher]);

  const handleLoadMoreGear = useCallback(() => {
    if (!currentGearCursor || !hasMoreGear || isLoadingGear) return;
    setIsLoadingGear(true);
    fetcher.submit(
      { gearCursor: currentGearCursor },
      { method: 'get', action: '.' }
    );
  }, [currentGearCursor, hasMoreGear, isLoadingGear, fetcher]);

  const handleLoadMoreRecommended = useCallback(() => {
    if (!currentRecommendedCursor || !hasMoreRecommended || isLoadingRecommended) return;
    setIsLoadingRecommended(true);
    fetcher.submit(
      { recommendedCursor: currentRecommendedCursor },
      { method: 'get', action: '.' }
    );
  }, [currentRecommendedCursor, hasMoreRecommended, isLoadingRecommended, fetcher]);

  // === Menu Transformation ===
  const updateMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => {
      const handle = item.resource?.handle || item.title.toLowerCase().replace(/\s+/g, '-');
      let url = `/collections/${handle}`;

      if (item.type === 'PRODUCT') {
        url = `/products/${handle}`;
      } else if (item.type === 'PAGE') {
        url = `/pages/${handle}`;
      }

      return {
        ...item,
        url,
        items: item.items?.length ? updateMenuItems(item.items) : [],
      };
    });
  };

  const menuItems = productsForNav?.menu?.items[0]?.items || [];
  useEffect(() => {
    if (menuItems.length === 0) return;
    setMenu(updateMenuItems(menuItems));
  }, [menuItems]);

  return (
    <div >
      <Suspense fallback={<div className="min-h-[50vh]"></div>}>
        <Await resolve={data.homePageHeroData}>
          {(homePageHeroData) => (
            <HeroSection
              heroData={homePageHeroData?.heroes}
              bgColor="bg-transparent"
            />
          )}
        </Await>
      </Suspense>

      <div className="home">
        <div className="py-8 space-y-12">
          {/* VICE GOLF BALLS - Infinite Scroll */}
          {golfBalls.length > 0 && (
            <ProductGrid
              products={golfBalls}
              title="VICE GOLF BALLS"
              categoryHandle="golf-balls"
              onLoadMore={handleLoadMoreGolfBalls}
              hasMore={hasMoreGolfBalls}
              loading={isLoadingGolfBalls}
              sessionDiscount={sessionDiscount}
            />
          )}
          {/* VICE GOLF CLUBS - Infinite Scroll */}
          {golfClubs.length > 0 && (
            <ProductGrid
              products={golfClubs}
              title="VICE GOLF CLUBS"
              categoryHandle="golf-clubs"
              onLoadMore={handleLoadMoreGolfClubs}
              hasMore={hasMoreGolfClubs}
              loading={isLoadingGolfClubs}
              sessionDiscount={sessionDiscount}
            />
          )}
          {/* VICE GEAR - Now with Infinite Scroll */}
          {gearProducts.length > 0 && (
            <ProductGrid
              products={gearProducts}
              title="VICE GEAR"
              categoryHandle="gear"
              onLoadMore={handleLoadMoreGear}
              hasMore={hasMoreGear}
              loading={isLoadingGear}
              sessionDiscount={sessionDiscount}
            />
          )}
        </div>
        <Suspense fallback={<div className="min-h-[20vh]"></div>}>
          <Await resolve={Promise.all([data.homePageHeroData, data.homePageSectionData])}>
            {([homePageHeroData, homePageSectionData]) => (
              <>
                <ClientLogos brands={homePageHeroData?.brand || []} />
                {homePageSectionData?.homeCategories && (
                  <ShopByCategories
                    menuItems={menu.slice(0, 4)}
                    sanityHomeCategories={homePageSectionData?.homeCategories}
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
        {/* VICE APPAREL - Infinite Scroll */}
        {apparelProducts.length > 0 && (
          <ProductGrid
            products={apparelProducts}
            title="VICE APPAREL"
            categoryHandle="apparel"
            onLoadMore={handleLoadMoreApparel}
            hasMore={hasMoreApparel}
            loading={isLoadingApparel}
            sessionDiscount={sessionDiscount}
          />
        )}
      </div>
      <Suspense fallback={<div className="min-h-[50vh]"></div>}>
        <Await resolve={data.homePageSectionData}>
          {(homePageSectionData) => (
            <HeroSection
              heroData={homePageSectionData?.secondaryHero || null}
              textColor="text-black"
              buttonBgColor="bg-black"
              buttonTextColor="text-white"
              bgColor="bg-transparent"
              center={true}
            />
          )}
        </Await>
      </Suspense>
      {/* {recommendedProducts.length > 0 && (
        <ProductGrid
          products={recommendedProducts}
          title="RECOMMENDED PRODUCTS"
          categoryHandle="recommended"
          onLoadMore={handleLoadMoreRecommended}
          hasMore={hasMoreRecommended}
          loading={isLoadingRecommended}
        />
      )} */}
      <div className='home'>
        <Suspense fallback={<div className="min-h-[50vh]"></div>}>
          <Await resolve={data.homePageViceLookData}>
            {(homePageViceLookData) => (
              <ViceLookSection data={homePageViceLookData?.viceLook} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}
function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      {/* <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br /> */}
    </div>

  );
}

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
// fragment RecommendedProduct on Product {
// id
// title
// handle
// priceRange {
// minVariantPrice {
// amount
// currencyCode
// }
// }
// featuredImage {
// id
// url
// altText
// width
// height
// }
// }
// query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
// @inContext(country: $country, language: $language) {
// products(first: 4, sortKey: UPDATED_AT, reverse: true) {
// nodes {
// ...RecommendedProduct
// }
// }
// }
// ` as con
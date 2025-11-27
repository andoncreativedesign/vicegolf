// app\routes\($locale)._index.tsx
import { Await, useLoaderData, Link, useRouteLoaderData, useFetcher } from 'react-router';
import type { Route } from './+types/_index';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { Image } from '@shopify/hydrogen';
import type { FeaturedCollectionFragment, RecommendedProductsQuery } from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { HeroSection } from '~/components/HeroSection';
import { ProductGrid } from '~/components/ProductGrid';
import { getHomePageData } from '~/lib/sanity/home';
import {
  createCategoryQuery,
  MULTIPLE_COLLECTIONS_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  type MenuData,
} from '~/lib/shopify/product-queries';
import ClientLogos from '~/components/Home/ClientLogos';
import ShopByCategories from '~/components/Home/ShopByCategories';
import { ViceLookSection } from '~/components/Home/ViceLookSection';
import type { MenuItem } from '~/lib/shopify/product-queries';
export const meta: Route.MetaFunction = () => {
  return [{ title: 'Vice Golf | Home' }];
};
export async function loader(args: Route.LoaderArgs) {
  const deferredData = await loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const homePageData = await getHomePageData();
  return { ...deferredData, ...criticalData, homePageData };
}
async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const golfBallsCursor = url.searchParams.get('golfBallsCursor') || null;
  const golfClubsCursor = url.searchParams.get('golfClubsCursor') || null;
  const apparelCursor = url.searchParams.get('apparelCursor') || null;
  const gearCursor = url.searchParams.get('gearCursor') || null;
  const [collectionsData, categoryProducts] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(MULTIPLE_COLLECTIONS_QUERY, {
      variables: {
        golfBallsHandle: createCategoryQuery('Golf Balls'),
        golfBallsCursor,
        golfClubsHandle: createCategoryQuery('Golf Club Set'),
        golfClubsCursor,
        apparelHandle: createCategoryQuery('Gloves Men'),
        apparelCursor,
        gearHandle: createCategoryQuery('Polo'),
        limitedEditionsHandle: createCategoryQuery('Towels'),
        fittingCustomisationHandle: createCategoryQuery('Longsleeve'),
        juniorsHandle: createCategoryQuery('Divot Tool'),
        first: 5,
        gearCursor,
      },
    }),
  ]);
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
  };
}
async function loadDeferredData({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const recommendedCursor = url.searchParams.get('recommendedCursor') || null;
  const recommendedProducts = await context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        first: 5,
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
export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<{ productsForNav: MenuData }>('root');
  const fetcher = useFetcher();
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
    const getAllResourceIdsOfChild = (items: MenuItem[]) =>
      JSON.stringify(items.map((i) => i.resourceId || ''));
    return items.map((item) => ({
      ...item,
      url: item.resourceId
        ? `/collections/${encodeURIComponent(JSON.stringify([item.resourceId]))}/${encodeURIComponent(item.title)}`
        : `/collections/${encodeURIComponent(getAllResourceIdsOfChild(item.items))}/${encodeURIComponent(item.title)}`,
      items: item.items?.length ? updateMenuItems(item.items) : [],
    }));
  };
  const menuItems = productsForNav?.menu?.items[0]?.items || [];
  useEffect(() => {
    if (menuItems.length === 0) return;
    setMenu(updateMenuItems(menuItems));
  }, [menuItems]);
  return (
    <div className="home">
      <HeroSection heroData={data.homePageData?.heroes} />
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
          />
        )}
        {/* VICE APPAREL - Infinite Scroll */}
        {apparelProducts.length > 0 && (
          <ProductGrid
            products={apparelProducts}
            title="VICE APPAREL"
            categoryHandle="apparel"
            onLoadMore={handleLoadMoreApparel}
            hasMore={hasMoreApparel}
            loading={isLoadingApparel}
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
          />
        )}
      </div>
      <ClientLogos brands={data.homePageData?.brand || []} />
      {data?.homePageData?.homeCategories && (
        <ShopByCategories
          menuItems={menu.slice(0, 4)}
          sanityHomeCategories={data?.homePageData?.homeCategories}
        />
      )}
      <HeroSection heroData={data.homePageData?.secondaryHero || null} />
      {recommendedProducts.length > 0 && (
        <ProductGrid
          products={recommendedProducts}
          title="RECOMMENDED PRODUCTS"
          categoryHandle="recommended"
          onLoadMore={handleLoadMoreRecommended}
          hasMore={hasMoreRecommended}
          loading={isLoadingRecommended}
        />
      )}
      <ViceLookSection />
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
      <h2>Recommended Products</h2>
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
      <br />
    </div>
  );
}
const ALL_PRODUCTS_QUERY = `#graphql
  fragment ProductFragment on Product {
    id
    title
    description
    handle
    productType
    vendor
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
        }
        sku
        barcode
        quantityAvailable
      }
    }
    options {
      name
      values
    }
    collections(first: 10) {
      nodes {
        id
        title
        handle
      }
    }
    createdAt
    updatedAt
    publishedAt
  }
  query AllProducts(
    $first: Int = 250
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...ProductFragment
        }
      }
    }
  }
` as const;
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;
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
// ` as const;
// app/routes/($locale)._index.tsx (updated to include HeroSection and ProductGrids)
import { Await, useLoaderData, Link, useRouteLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import { Suspense, useEffect, useState } from 'react';
import { createContentSecurityPolicy, Image } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { HeroSection } from '~/components/HeroSection';
import { ProductGrid } from '~/components/ProductGrid';
// import {getHeroSectionData} from '~/lib/sanity';
import { getHomePageData } from '~/lib/sanity/home';
import { createCategoryQuery, GET_POPULAR_COLLECTIONS, MULTIPLE_COLLECTIONS_QUERY, RECOMMENDED_PRODUCTS_QUERY, type MenuData } from '~/lib/shopify/product-queries';
import ClientLogos from '~/components/Home/ClientLogos';
import ShopByCategories from '~/components/Home/ShopByCategories';
import type { MenuItem } from '~/lib/shopify/product-queries';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = await loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const homePageData = await getHomePageData();

  return { ...deferredData, ...criticalData, homePageData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const golfBallsHandle = createCategoryQuery('Golf Balls');
  const golfClubsHandle = createCategoryQuery('Golf Club Set');
  const apparelHandle = createCategoryQuery('Gloves Men');
  const gearHandle = createCategoryQuery('Polo');
  const limitedEditionsHandle = createCategoryQuery('Towels');
  const fittingCustomisationHandle = createCategoryQuery('Longsleeve');
  const juniorsHandle = createCategoryQuery('Divot Tool');

  const [collectionsData, categoryProducts, popularCollections] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(MULTIPLE_COLLECTIONS_QUERY, {
      variables: {
        golfBallsHandle,
        golfClubsHandle,
        apparelHandle,
        gearHandle,
        limitedEditionsHandle,
        fittingCustomisationHandle,
        juniorsHandle,
        first: 15,
      },
    }),
    context.storefront.query(GET_POPULAR_COLLECTIONS, {
      variables: {
        first: 4,
      },
    }),
  ]);

  const collectionsTransformed = popularCollections?.collections?.edges?.map((edge: { node: FeaturedCollectionFragment }) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    description: edge.node.description,
    image: edge.node.image
  }))

  return {
    featuredCollection: collectionsData.collections.nodes[0],
    categoryProducts,
    popularCollections: collectionsTransformed,
    productsForNav: context.productsForNav
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
async function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = await context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  // const { productsForNav } = useLoaderData<{ productsForNav: MenuData }>();  
  const rootData = useRouteLoaderData<{ productsForNav: MenuData }>("root");
  const productsForNav = rootData?.productsForNav;

  const [menu, setMenu] = useState<MenuItem[]>([])

  const updateMenuItems = (items: MenuItem[]): MenuItem[] => {
    const getAllResourceIdsOfChild = (items: MenuItem[]) => {
      const ids = items.map(item => item.resourceId || '')
      return JSON.stringify(ids)
    }

    return items.map(item => {
      const updatedItem = {
        ...item,
        url: item.resourceId
          ? `/collections/${encodeURIComponent(JSON.stringify([item.resourceId]))}/${decodeURIComponent(item.title)}`
          : `/collections/${encodeURIComponent(getAllResourceIdsOfChild(item.items))}/${decodeURIComponent(item.title)}`
      };

      if (item.items && item.items.length > 0) {
        updatedItem.items = updateMenuItems(item.items);
      }

      return updatedItem;
    });
  };

  const menuItems = productsForNav?.menu?.items[0]?.items || [];

  useEffect(() => {
    if (menuItems.length === 0) return;
    const updatedMenu = updateMenuItems(menuItems);
    setMenu(updatedMenu);
  }, [menuItems]);

  useEffect(() => {
    console.log("home page data", data.homePageData?.homeCategories)
  }, [data])

  return (
    <div className="home">
      <HeroSection heroData={data.homePageData?.heroes} />

      {/* Product Grids by Category */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Golf Balls Section */}
        {data.categoryProducts?.golfBalls?.nodes && (
          <ProductGrid
            products={data.categoryProducts.golfBalls.nodes}
            title="VICE GOLF BALLS"
            categoryHandle="golf-balls"
          />
        )}

        {/* Golf Clubs Section */}
        {data.categoryProducts?.golfClubs?.nodes && (
          <ProductGrid
            products={data.categoryProducts.golfClubs.nodes}
            title="VICE GOLF CLUBS"
            categoryHandle="golf-clubs"
          />
        )}

        {/* Apparel Section */}
        {data.categoryProducts?.apparel?.nodes && (
          <ProductGrid
            products={data.categoryProducts.apparel.nodes}
            title="VICE APPAREL"
            categoryHandle="apparel"
          />
        )}

        {/* Gear Section */}
        {data.categoryProducts?.gear?.nodes && (
          <ProductGrid
            products={data.categoryProducts.gear.nodes}
            title="VICE GEAR"
            categoryHandle="gear"
          />
        )}
      </div>

      {/* <FeaturedCollection collection={data.featuredCollection} /> */}

      <ClientLogos brands={data.homePageData?.brand || []} />
      
      {data?.homePageData?.homeCategories &&
        <ShopByCategories
          menuItems={menu.slice(0, 4)}
          sanityHomeCategories={data?.homePageData?.homeCategories}
        />
      }

      <HeroSection heroData={data.homePageData?.secondaryHero || null} />

      {data.recommendedProducts?.products?.nodes && (
        <ProductGrid
          products={data.recommendedProducts.products.nodes}
          title="RECOMMENDED PRODUCTS"
          categoryHandle="recommended"
        />
      )}

      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
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
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     featuredImage {
//       id
//       url
//       altText
//       width
//       height
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// ` as const;
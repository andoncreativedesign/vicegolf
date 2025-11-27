export const createCategoryQuery = (handle: string) => {
  return `product_type:'${handle}'`
}

// GraphQL queries for fetching products by collection

export const COLLECTION_PRODUCTS_QUERY = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    productType
    vendor
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }

  query CollectionProducts(
    $handle: String!
    $first: Int = 10
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

// app/lib/shopify/product-queries.ts

export const MULTIPLE_COLLECTIONS_QUERY = `#graphql
fragment ProductCard on Product {
  id
  title
  handle
  productType
  vendor
  featuredImage {
    id
    url
    altText
    width
    height
  }
  variants(first: 1) {
    nodes {
      id
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
}

query MultipleProductGroups(
  $golfBallsHandle: String!
  $golfClubsHandle: String!
  $apparelHandle: String!
  $gearHandle: String!
  $limitedEditionsHandle: String!
  $fittingCustomisationHandle: String!
  $juniorsHandle: String!
  $first: Int = 15
  $golfBallsCursor: String
  $gearCursor: String
  $apparelCursor: String    # ← NEW
) {
  golfBalls: products(first: $first, after: $golfBallsCursor, query: $golfBallsHandle) {
    nodes { ...ProductCard }
    pageInfo { hasNextPage endCursor }
  }

  golfClubs: products(first: $first, query: $golfClubsHandle) {
    nodes { ...ProductCard }
  }

  apparel: products(first: $first, after: $apparelCursor, query: $apparelHandle) {   # ← NOW PAGINATED
    nodes { ...ProductCard }
    pageInfo { hasNextPage endCursor }
  }

  gear: products(first: $first, after: $gearCursor, query: $gearHandle) {
    nodes { ...ProductCard }
    pageInfo { hasNextPage endCursor }
  }

  limitedEditions: products(first: $first, query: $limitedEditionsHandle) {
    nodes { ...ProductCard }
  }

  fittingCustomisation: products(first: $first, query: $fittingCustomisationHandle) {
    nodes { ...ProductCard }
  }

  juniors: products(first: $first, query: $juniorsHandle) {
    nodes { ...ProductCard }
  }
}
` as const;

/* 
export const MULTIPLE_COLLECTIONS_QUERY_FOR_NAV = `#graphql
fragment ProductCard on Product {
  id
  title
  handle
  productType
  vendor
  featuredImage {
    id
    url
    altText
    width
    height
  }
  variants(first: 1) {
    nodes {
      id
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
}

query MultipleProductGroups(
  $golfBallsHandle: String!
  $golfClubsHandle: String!
  $apparelHandle: String!
  $gearHandle: String!
  $limitedEditionsHandle: String!
  $fittingCustomisationHandle: String!
  $juniorsHandle: String!
  $first: Int = 8
) {
  golfBalls: products(first: $first, query: $golfBallsHandle) {
    nodes {
      ...ProductCard
    }
  }
  golfClubs: products(first: $first, query: $golfClubsHandle) {
    nodes {
      ...ProductCard
    }
  }
  apparel: products(first: $first, query: $apparelHandle) {
    nodes {
      ...ProductCard
    }
  }
  gear: products(first: $first, query: $gearHandle) {
    nodes {
      ...ProductCard
    }
  }
  limitedEditions: products(first: $first, query: $limitedEditionsHandle) {
    nodes {
      ...ProductCard
    }
  }
  fittingCustomisation: products(first: $first, query: $fittingCustomisationHandle) {
    nodes {
      ...ProductCard
    }
  }
  juniors: products(first: $first, query: $juniorsHandle) {
    nodes {
      ...ProductCard
    }
  }
}
`;
*/


export interface MenuItemImage {
  url: string;
  altText: string | null;
}

export interface MenuItemResource {
  id: string;
  handle: string;
  title: string;
  image?: {
    url: string;
    altText: string | null;
  };
}

export interface MenuItem {
  id: string;
  title: string;
  type: string;
  url: string;
  resourceId: string | null;
  resource: MenuItemResource | null;
  items: MenuItem[];
}

export interface MenuData {
  menu: {
    id: string;
    title: string;
    items: MenuItem[];
  };
}

export const MULTIPLE_COLLECTIONS_QUERY_FOR_NAV = `#graphql
query GetMenu($handle: String!) {
  menu(handle: $handle) {
    id
    title
    items {
      id
      title
      type
      url
      resourceId
      resource {
        ... on Collection {
          id
          handle
          title
          image {
            url
            altText
          }
        }
        ... on Product {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
        }
      }
      items {
        id
        title
        type
        url
        resourceId
        resource {
          ... on Collection {
            id
            handle
            title
            image {
              url
              altText
            }
          }
          ... on Product {
            id
            handle
            title
            featuredImage {
              url
              altText
            }
          }
        }
        items {
          id
          title
          type
          url
          resourceId
          resource {
            ... on Collection {
              id
              handle
              title
              image {
                url
                altText
              }
            }
            ... on Product {
              id
              handle
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
}
`;



export const GET_POPULAR_COLLECTIONS = `#graphql
  query GetPopularCollections(
    $first: Int = 20
    $sortKey: CollectionSortKeys = UPDATED_AT
    $reverse: Boolean = true
  ) {
    collections(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          handle
          title
          updatedAt
          description
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;


const MONEY_FRAGMENT = `
fragment MoneyProductItem on MoneyV2 {
  amount
  currencyCode
}
`;

const PRODUCT_FRAGMENT_FOR_COLLECTION = `
fragment ProductItem on Product {
  id
  handle
  title
  productType
  vendor
  
  metafield(namespace: "custom", key: "family") {
    id
    namespace
    key
    type
    value
  }

  variants(first: 1) {
        nodes {
      id
      availableForSale
            price {
        amount
        currencyCode
      }
            compareAtPrice {
        amount
        currencyCode
      }
    }
  }
    featuredImage {
    id
    altText
    url
    width
    height
  }
    priceRange {
        minVariantPrice {
            ...MoneyProductItem
    }
        maxVariantPrice {
            ...MoneyProductItem
    }
  }
}`;


// export const GET_PRODUCTS_BY_COLLECTION = `#graphql
// ${MONEY_FRAGMENT}
// ${PRODUCT_FRAGMENT_FOR_COLLECTION}

// query ProductsByType(
//   $handle: String!
//   $country: CountryCode
//   $language: LanguageCode
//   $first: Int
//   $startCursor: String
//   $endCursor: String
// ) @inContext(country: $country, language: $language) {
//   products(
//     first: $first
//     before: $startCursor
//     after: $endCursor
//     query: $handle
//   ) {
//     nodes {
//       ...ProductItem
//     }
//     pageInfo {
//       hasPreviousPage
//       hasNextPage
//       endCursor
//       startCursor
//     }
//   }
// }
// `;


export interface ShopifyCollectionResponse {
  nodes: ShopifyCollection[];
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ShopifyImage | null;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
    pageInfo: ShopifyPageInfo;
  };
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  productType: string;
  vendor: string;
  featuredImage?: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: {
    nodes: ShopifyVariant[];
  };
}

export interface ShopifyVariant {
  id: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
}

export interface ShopifyImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string;
  endCursor?: string;
}


export const GET_PRODUCTS_BY_COLLECTION = `#graphql
${MONEY_FRAGMENT}
${PRODUCT_FRAGMENT_FOR_COLLECTION}

query GetProductsByCollectionIds(
  $ids: [ID!]!
  $country: CountryCode
  $language: LanguageCode
  $first: Int
  $startCursor: String
  $endCursor: String
) @inContext(country: $country, language: $language) {
  nodes(ids: $ids) {
    ... on Collection {
      id
      handle
      title
      description
      image {
        url
        altText
      }
      products(
        first: $first
        before: $startCursor
        after: $endCursor
      ) {
        edges {
          node {
            ...ProductItem
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
}
`;




const PRODUCT_CARD_FRAGMENT = `
fragment ProductCardFragment on Product {
    id
    title
    handle
    productType
    vendor
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
fragment ProductCardFragment on Product {
    id
    title
    handle
    productType
    vendor
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }

  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
` as const;

export const PRODUCTS_BY_FAMILY_QUERY = `#graphql
fragment ColorVariantProduct on Product {
  id
  title
  handle
  productType
  vendor
  metafield(namespace: "custom", key: "family") {
    id
    namespace
    key
    type
    value
  }
  featuredImage {
    id
    url
    altText
    width
    height
  }
  images(first: 2) {
    nodes {
      id
      url
      altText
      width
      height
    }
  }
  variants(first: 1) {
    nodes {
      id
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
}

query ProductsByFamily(
  $searchQuery: String!
  $country: CountryCode
  $language: LanguageCode
  $first: Int = 20
) @inContext(country: $country, language: $language) {
  products(first: $first, query: $searchQuery) {
    nodes {
      ...ColorVariantProduct
    }
  }
}
` as const;


export interface UIColorVariant {
  id: string;
  title: string;
  handle: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
}

export const ADMIN_PRODUCTS_BY_FAMILY = `
  query ProductsByFamily($searchQuery: String!) {
    products(first: 20, query: $searchQuery) {
      edges {
        node {
          id
          title
          handle
          productType
          vendor

          # Product-level: Product Family metafield
          family: metafield(namespace: "custom", key: "family") {
            id
            namespace
            key
            type
            value
          }

          # Product-level: Variant Image metafield 
          variantImage: metafield(namespace: "custom", key: "variant_image") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }

          featuredImage {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
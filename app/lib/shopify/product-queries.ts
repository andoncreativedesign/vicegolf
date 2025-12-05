// app\lib\shopify\product-queries.ts
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
  featuredImage?: {
    url: string;
    altText: string | null;
  };
  metafield?: {
    key: string,
    value: any
  }
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

export interface SecondaryMenuItem {
  title: string,
  type: "COLLECTION" | "PAGE",
  handle: string
}

export interface SecondaryMenu {
  section: string,
  items: SecondaryMenuItem[]
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
          metafield(namespace: "custom", key: "exclude_collections_from_nav") {
            key
            value
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

        ... on Page {
          id
          handle
          title
          metafield(namespace: "custom", key: "menu") {
            key
            value
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
            metafield(namespace: "custom", key: "exclude_collections_from_nav") {
              key
              value
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

          ... on Page {
            id
            handle
            title
            metafield(namespace: "custom", key: "menu") {
              key
              value
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
              metafield(namespace: "custom", key: "exclude_collections_from_nav") {
                key
                value
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

            ... on Page {
              id
              handle
              title
              metafield(namespace: "custom", key: "menu") {
                key
                value
              }
            }

          }
        }
      }
    }
  }
}

`


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

  query RecommendedProducts ($country: CountryCode, $language: LanguageCode, $first: Int = 15, $after: String)
    @inContext(country: $country, language: $language) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCardFragment
      }
      pageInfo {
        hasNextPage
        endCursor
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

// export const ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD = `
//   query ProductsByFamily($searchQuery: String!) {
//     products(first: 20, query: $searchQuery) {
//       edges {
//         node {
//           id
//           title
//           handle
//           productType
//           vendor
//           featuredImage {
//             id
//             url
//             altText
//             width
//             height
//           }

//           variants(first: 1) {
//             nodes {
//               id
//               availableForSale
//               price {
//                 amount
//                 currencyCode
//               }
//               compareAtPrice {
//                 amount
//                 currencyCode
//               }
//             }
//           }

//           #Product-level: Product Family metafield
//           family: metafield(namespace: "custom", key: "family") {
//             id
//             namespace
//             key
//             type
//             value
//           }
//         }
//       }
//     }
//   }
// `;

export const ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD = `
  query ProductsByFamily($searchQuery: String!) {
    products(first: 20, query: $searchQuery) {
      edges {
        node {
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

          family: metafield(namespace: "custom", key: "family") {
            id
            namespace
            key
            type
            value
          }
        }
      }
    }
  }
`;


export const GET_COLLECTION_DETAILS_WITHOUT_PRODUCTS = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
    }
  }
`;

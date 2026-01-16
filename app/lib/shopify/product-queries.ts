// app\lib\shopify\product-queries.ts
export const createCategoryQuery = (handle: string) => {
  // return `product_type:'${handle}'`
  return handle
}

// GraphQL queries for fetching products by collection

export const COLLECTION_PRODUCTS_QUERY = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    availableForSale
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

export const COLLECTION_PRODUCTS_PAGINATED_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $first: Int = 10
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first, after: $after) {
        nodes {
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
        pageInfo {
          hasNextPage
          endCursor
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
  availableForSale
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

// ! collection query without sorting
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

// ! collection with sorting
/* 
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
        sortKey: PRICE
        reverse: false
      ) {
        edges {
          node {
            ...ProductItem
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
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
*/

const PRODUCT_CARD_FRAGMENT = `
fragment ProductCardFragment on Product {
    id
    title
    handle
    availableForSale
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
    availableForSale
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
  availableForSale
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

export interface ClubVariant {
  node: {
    id: string;
    title: string;
    handle: string;
    productType: string;
    vendor: string;
    club_hand_orientation: {
      id: string;
      namespace: string;
      key: string;
      type: string;
      value: string;
    } | null;
    variantImage: {
      reference: {
        id: string;
        image: {
          url: string;
          altText: string | null;
          width: number | null;
          height: number | null;
        };
      };
    } | null;
    featuredImage: {
      id: string;
      url: string;
      altText: string | null;
      width: number | null;
      height: number | null;
    } | null;
  };
}

export const ADMIN_PRODUCTS_BY_CLUB_FAMILY = `#graphql
  query ProductsByFamily($searchQuery: String!) {
    products(first: 20, query: $searchQuery) {
      edges {
        node {
          id
          title
          handle
          availableForSale: totalInventory
          productType
          vendor

          # Product-level: Product Family metafield
          club_hand_orientation: metafield(namespace: "custom", key: "club_hand_orientation") {
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

export const ADMIN_PRODUCTS_BY_FAMILY = `#graphql
  query ProductsByFamily($searchQuery: String!) {
    products(first: 20, query: $searchQuery) {
      edges {
        node {
          id
          title
          handle
          availableForSale: totalInventory
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


export const ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD = `#graphql
  query ProductsByFamily($searchQuery: String!) {
    products(first: 20, query: $searchQuery) {
      edges {
        node {
          id
          handle
          title
          availableForSale: totalInventory
          productType
          vendor

          # MAIN: Variant image metafield (file_reference)
          variantImage: metafield(namespace: "custom", key: "variant_image") {
            id
            type
            reference {
              __typename

              # MediaImage file
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }

              # File-based uploads (Admin API 2025 returns File)
              ... on File {
                id
                preview {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }

          # Featured image
          featuredImage {
            url
            altText
            width
            height
          }

          # Product family tag/metafield
          family: metafield(namespace: "custom", key: "family") {
            key
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



const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    availableForSale
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    metafield(namespace: "custom", key: "family") {
      id
      namespace
      key
      type
      value
    }
    metafields(identifiers: [
      {namespace: "custom", key: "family"}
      {namespace: "custom", key: "category_variant"}
      {namespace: "custom", key: "primary_collection_handle"}
      {namespace: "custom", key: "club_family"}
      {namespace: "custom", key: "club_hand_orientation"}
      {namespace: "custom", key: "bundle_btn_text"}
      {namespace: "custom", key: "bundle_btn_handle"}
    ]) {
      id
      namespace
      key
      type
      value
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

/*
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    metafield(namespace: "custom", key: "family") {
      id
      namespace
      key
      type
      value
    }
    metafields(identifiers: [
      {namespace: "custom", key: "family"}
      {namespace: "custom", key: "category_variant"}
      {namespace: "custom", key: "primary_collection_handle"}
    ]) {
      id
      namespace
      key
      type
      value
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
*/


// * cancel order

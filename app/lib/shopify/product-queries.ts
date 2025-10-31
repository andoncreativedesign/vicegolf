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

  query MultipleCollections(
    $golfBallsHandle: String!
    $golfClubsHandle: String!
    $apparelHandle: String!
    $gearHandle: String!
    $first: Int = 8
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    golfBalls: collection(handle: $golfBallsHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    golfClubs: collection(handle: $golfClubsHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    apparel: collection(handle: $apparelHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    gear: collection(handle: $gearHandle) {
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

  query MultipleCollections(
    $golfBallsHandle: String!
    $golfClubsHandle: String!
    $apparelHandle: String!
    $gearHandle: String!
    $first: Int = 8
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    golfBalls: collection(handle: $golfBallsHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    golfClubs: collection(handle: $golfClubsHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    apparel: collection(handle: $apparelHandle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
    gear: collection(handle: $gearHandle) {
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


export const GET_PRODUCTS_BY_COLLECTION = `
${MONEY_FRAGMENT}
${PRODUCT_FRAGMENT_FOR_COLLECTION}
query Collection(
  $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
) @inContext(country: $country, language: $language) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
            nodes {
                ...ProductItem
      }
            pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
}`;



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
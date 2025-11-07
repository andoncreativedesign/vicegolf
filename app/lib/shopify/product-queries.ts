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


export const GET_PRODUCTS_BY_COLLECTION = `#graphql
${MONEY_FRAGMENT}
${PRODUCT_FRAGMENT_FOR_COLLECTION}

query ProductsByType(
  $handle: String!
  $country: CountryCode
  $language: LanguageCode
  $first: Int
  $startCursor: String
  $endCursor: String
) @inContext(country: $country, language: $language) {
  products(
    first: $first
    before: $startCursor
    after: $endCursor
    query: $handle
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
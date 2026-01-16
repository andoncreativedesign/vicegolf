export const FEATURED_COLLECTION_QUERY = `#graphql
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

    #Product-level: Product Family metafield
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

/* ! working query
export const MULTIPLE_COLLECTIONS_QUERY = `#graphql
fragment ProductCard on Product {
  id
  title
  handle
  productType
  tags
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

  #Product-level: Product Family metafield
  family: metafield(namespace: "custom", key: "family") {
    id
    namespace
    key
    type
    value
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
  $golfClubsCursor: String
  $apparelCursor: String
  $gearCursor: String
) {
  golfBalls: products(first: $first, after: $golfBallsCursor, query: $golfBallsHandle) {
    nodes {
      ...ProductCard
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }

 golfClubs: products(first: $first, after: $golfClubsCursor, query: $golfClubsHandle) {
  nodes {
    ...ProductCard
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
  apparel: products(first: $first, after: $apparelCursor, query: $apparelHandle) {
    nodes {
      ...ProductCard
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }

  gear: products(first: $first, after: $gearCursor, query: $gearHandle) {
    nodes {
      ...ProductCard
    }
    pageInfo {
      hasNextPage
      endCursor
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
*/

export const MULTIPLE_COLLECTIONS_QUERY = `#graphql
fragment ProductCard on Product {
  id
  title
  handle
  availableForSale
  productType
  tags
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

  #Product-level: Product Family metafield
  family: metafield(namespace: "custom", key: "family") {
    id
    namespace
    key
    type
    value
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
  $golfClubsCursor: String
  $apparelCursor: String
  $gearCursor: String
) {

  golfBalls: collection(handle: $golfBallsHandle) {
    id
    title
    products(first: $first, after: $golfBallsCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  golfClubs: collection(handle: $golfClubsHandle) {
    id
    title
    products(first: $first, after: $golfClubsCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  apparel: collection(handle: $apparelHandle) {
    id
    title
    products(first: $first, after: $apparelCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  gear: collection(handle: $gearHandle) {
    id
    title
    products(first: $first, after: $gearCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  limitedEditions: collection(handle: $limitedEditionsHandle) {
    id
    title
    products(first: $first) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  fittingCustomisation: collection(handle: $fittingCustomisationHandle) {
    id
    title
    products(first: $first) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  juniors: collection(handle: $juniorsHandle) {
    id
    title
    products(first: $first) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
` as const;


export const FAMILY_GROUP_QUERY = `#graphql
  query FamilyGroupQuery($query: String!) {
    products(first: 50, query: $query) {
      nodes {
        id
        title
        handle
        productType
        tags
        vendor
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
`;

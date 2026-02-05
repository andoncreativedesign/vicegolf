// Query for fetching automatic discounts (for segment-based discounts)
export const GET_AUTOMATIC_DISCOUNT_QUERY = `#graphql
  query getAutomaticDiscounts($first: Int!, $query: String) {
    automaticDiscountNodes(first: $first, query: $query) {
      nodes {
        id
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            title
            status
            summary
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
              items {
                ... on AllDiscountItems {
                  __typename
                }
                ... on DiscountProducts {
                  products(first: 100) {
                    nodes {
                      id
                    }
                  }
                }
                ... on DiscountCollections {
                  collections(first: 100) {
                    nodes {
                      id
                    }
                  }
                }
              }
            }
          }
          ... on DiscountAutomaticBxgy {
            title
            status
            summary
          }
        }
      }
    }
  }
`;

// Query for fetching code discount details (for manual discount codes)
export const GET_CODE_DISCOUNT_QUERY = `#graphql
  query getDiscount($query: String!) {
    codeDiscountNodes(first: 1, query: $query) {
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            summary
            codes(first: 1) {
              nodes {
                code
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

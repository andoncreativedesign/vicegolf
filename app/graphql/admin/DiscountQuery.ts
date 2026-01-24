// Types for GET_AUTOMATIC_DISCOUNT_QUERY

export type AutomaticDiscountQueryVariables = {
  query: string;
  first: number;
};

export type AutomaticDiscountQueryResponse = {
  automaticDiscountNodes: {
    nodes: Array<{
      automaticDiscount:
        | {
            __typename?: 'DiscountAutomaticBasic';
            title: string;
            customerGets: {
              value:
                | {
                    __typename?: 'DiscountPercentage';
                    percentage: number;
                  }
                | {
                    __typename?: 'DiscountAmount';
                    amount: {
                      amount: string;
                      currencyCode: string;
                    };
                  };
            };
          }
        | null;
    }>;
  };
};




// Query for fetching automatic discount details from Shopify Admin API
export const GET_AUTOMATIC_DISCOUNT_QUERY = `#graphql
  query getPlusDiscount($query: String!, $first: Int!) {
    automaticDiscountNodes(first: $first, query: $query) {
      nodes {
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            title
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

// Query for fetching customer tags and discount info together
export const GET_CUSTOMER_AND_DISCOUNT_QUERY = `#graphql
  query getAccountInfo($id: ID!, $discountQuery: String!) {
    customer(id: $id) {
      tags
    }
    codeDiscountNodes(first: 1, query: $discountQuery) {
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
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

export const GET_DISCOUNT_QUERY = `#graphql
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
              }
            }
          }
        }
      }
    }
  }
`;

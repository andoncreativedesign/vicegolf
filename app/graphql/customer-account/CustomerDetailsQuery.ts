// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    firstName
    lastName
    tags
    
    phoneNumber {
      phoneNumber
    }
    emailAddress {
      emailAddress
    }
    defaultAddress {
      ...Address
    }
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
  }
  fragment Address on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;


export const GET_DISCOUNT_QUERY = `#graphql
query GetDiscountCode($query: String!) {
  discountCodeNodes(first: 5, query: $query) {
    nodes {
      id
      discountCode {
        ... on DiscountCode {
          title
          status
          codes(first: 10) {
            nodes {
              code
            }
          }
        }
      }
    }
  }
}
` as const;






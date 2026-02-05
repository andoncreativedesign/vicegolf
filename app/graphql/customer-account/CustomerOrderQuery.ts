// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
/*
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    price {
      ...OrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    totalDiscount {
      ...OrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
  }
  fragment Order on Order {
    id
    name
    confirmationNumber
    statusPageUrl
    fulfillmentStatus
    financialStatus

    returns(first: 10) {
      nodes {
        status
      }
    }
    processedAt
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    subtotal {
      ...OrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order($orderId: ID!, $language: LanguageCode)
    @inContext(language: $language) {
    order(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;
*/

export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }

  fragment OrderLineItemSimple on LineItem {
    id
    title
    quantity
    price {
      ...Money
    }
    totalDiscount {
      ...Money
    }
    variantTitle
  }

  query Order($orderId: ID!, $language: LanguageCode)
    @inContext(language: $language) {
    order(id: $orderId) {
      ... on Order {
        id
        name
        confirmationNumber
        statusPageUrl
        processedAt
        financialStatus
        fulfillmentStatus

        returns(first: 10) {
          nodes {
            status
          }
        }

        fulfillments(first: 1) {
          nodes {
            status
          }
        }
          
        subtotal {
          ...Money
        }

        totalTax {
          ...Money
        }

        totalPrice {
          ...Money
        }

        shippingAddress {
          name
          formatted
        }

        lineItems(first: 20) {
          nodes {
            ...OrderLineItemSimple
          }
        }

      }
    }
  }
` as const;

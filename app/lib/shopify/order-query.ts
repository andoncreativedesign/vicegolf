export const CANCEL_ORDER = `#graphql
  mutation OrderCancel(
    $orderId: ID!
    $notifyCustomer: Boolean
    $restock: Boolean!
    $reason: OrderCancelReason!
    $staffNote: String
    $refund: Boolean!
  ) {
    orderCancel(
      orderId: $orderId
      notifyCustomer: $notifyCustomer
      restock: $restock
      reason: $reason
      staffNote: $staffNote
      refund: $refund
    ) {
      job {
        id
        done
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const RETURN_CREATE = `#graphql
mutation ReturnCreate($returnInput: ReturnInput!) {
  returnCreate(returnInput: $returnInput) {
    userErrors {
      field
      message
    }
    return {
      id
      order {
        id
      }
      returnLineItems(first: 5) {
        edges {
          node {
            id
            quantity
            returnReason
          }
        }
      }
      status
    }
  }
}`;

export const RETURNABLE_FULFILLMENTS_QUERY = `
query ReturnableFulfillments($orderId: ID!, $first: Int!) {
  returnableFulfillments(orderId: $orderId, first: $first) {
    edges {
      node {
        returnableFulfillmentLineItems(first: $first) {
          edges {
            node {
              fulfillmentLineItem {
                id
              }
              quantity
              # returnReason completely removed - it doesn't exist
            }
          }
        }
      }
    }
  }
}
`;
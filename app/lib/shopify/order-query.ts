
// export const CANCEL_ORDER = `#graphql
//   mutation OrderCancel($orderId: ID!, $notifyCustomer: Boolean, $refundMethod: OrderCancelRefundMethodInput!, $restock: Boolean!, $reason: OrderCancelReason!, $staffNote: String) {
//     orderCancel(orderId: $orderId, notifyCustomer: $notifyCustomer, refundMethod: $refundMethod, restock: $restock, reason: $reason, staffNote: $staffNote) {
//       job {
//         id
//         done
//       }
//       orderCancelUserErrors {
//         field
//         message
//         code
//       }
//       userErrors {
//         field
//         message
//       }
//     }
// }`

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


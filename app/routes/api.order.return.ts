import type { ActionFunctionArgs } from 'react-router';
import { RETURN_CREATE, RETURNABLE_FULFILLMENTS_QUERY } from '~/lib/shopify/order-query';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';

async function createShopifyReturn({
  orderId,
  returnLineItems,
}: {
  orderId: string;
  returnLineItems: {
    fulfillmentLineItemId: string;
    quantity: number;
    returnReason: string;
  }[];
}) {
  const response = await axiosShopifyAdmin.post('', {
    query: RETURN_CREATE,
    variables: {
      returnInput: {
        orderId,
        returnLineItems,
        notifyCustomer: true,
      },
    },
  });

  const result = response.data?.data?.returnCreate;

  if (
    response.data?.errors?.length ||
    result?.userErrors?.length
  ) {
    throw new Error(
      [
        ...(response.data.errors ?? []),
        ...(result?.userErrors ?? []),
      ]
        .map((e: any) => e.message)
        .join(', ')
    );
  }

  return result.return;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('orderId')?.toString();
    const staffNote = formData.get('staffNote')?.toString() || 'OTHER';

    // Map frontend reasons to Shopify ReturnReason enum
    const REASON_MAP: Record<string, string> = {
      'SIZE_TOO_SMALL': 'SIZE_TOO_SMALL',
      'SIZE_TOO_LARGE': 'SIZE_TOO_LARGE',
      'DEFECTIVE': 'DEFECTIVE',
      'DAMAGED': 'DEFECTIVE',
      'NOT_AS_DESCRIBED': 'NOT_AS_DESCRIBED',
      'NO_LONGER_NEEDED': 'UNWANTED',
      'WRONG_ITEM': 'WRONG_ITEM',
      'BETTER_PRICE_AVAILABLE': 'OTHER', // Changed from UNWANTED to OTHER to allow specific note
      'OTHER': 'OTHER'
    };

    const LABEL_MAP: Record<string, string> = {
      'SIZE_TOO_SMALL': 'Size Too Small',
      'SIZE_TOO_LARGE': 'Size Too Large',
      'DEFECTIVE': 'Defective Product',
      'DAMAGED': 'Damaged in Transit',
      'NOT_AS_DESCRIBED': 'Not as Described',
      'NO_LONGER_NEEDED': 'No Longer Needed',
      'WRONG_ITEM': 'Wrong Item Received',
      'BETTER_PRICE_AVAILABLE': 'Better Price Available',
      'OTHER': 'Other'
    };

    const returnReason = REASON_MAP[staffNote] || 'OTHER';
    const returnReasonNote = LABEL_MAP[staffNote] || staffNote;

    // Remove returnLineItems requirement
    if (!orderId) {
      return new Response(
        JSON.stringify({
          error: 'orderId is required',
        }),
        { status: 400 }
      );
    }

    // First, get the returnable fulfillment line items to get correct IDs
    const returnableResponse = await axiosShopifyAdmin.post('', {
      query: RETURNABLE_FULFILLMENTS_QUERY,
      variables: {
        orderId,
        first: 50,
      },
    });

    const returnableFulfillments = returnableResponse.data?.data?.returnableFulfillments?.edges || [];
    const returnableLineItems = returnableFulfillments.flatMap((edge: any) =>
      edge.node?.returnableFulfillmentLineItems?.edges || []
    );

    if (returnableLineItems.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No returnable items found for this order. Order may not be fulfilled yet.',
        }),
        { status: 400 }
      );
    }

    const returnLineItems = returnableLineItems.map((edge: any) => ({
      fulfillmentLineItemId: edge.node.fulfillmentLineItem.id,
      quantity: edge.node.quantity,
      returnReason: returnReason,
      returnReasonNote: returnReasonNote,
    }));

    const returnResult = await createShopifyReturn({
      orderId,
      returnLineItems,
    });

    return new Response(
      JSON.stringify({
        success: true,
        return: returnResult,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[api.order.return] Error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create return',
      }),
      { status: 500 }
    );
  }
}

// ! working
// export async function action({ request }: ActionFunctionArgs) {
//   try {
//     const formData = await request.formData();
//     const orderId = formData.get('orderId')?.toString();

//     // Remove returnLineItems requirement
//     if (!orderId) {
//       return new Response(
//         JSON.stringify({
//           error: 'orderId is required',
//         }),
//         { status: 400 }
//       );
//     }

//     // First, get the returnable fulfillment line items to get correct IDs
//     const returnableResponse = await axiosShopifyAdmin.post('', {
//       query: RETURNABLE_FULFILLMENTS_QUERY,
//       variables: {
//         orderId,
//         first: 50,
//       },
//     });

//     const returnableLineItems = returnableResponse.data?.data?.returnableFulfillments?.[0]?.returnableFulfillmentLineItems?.edges || [];

//     if (returnableLineItems.length === 0) {
//       return new Response(
//         JSON.stringify({
//           error: 'No returnable items found for this order',
//         }),
//         { status: 400 }
//       );
//     }

//     // Map the returnable items to the format needed for returnCreate
//     const returnLineItems = returnableLineItems.map((edge: any) => ({
//       fulfillmentLineItemId: edge.node.fulfillmentLineItem.id,
//       quantity: edge.node.quantity,
//       returnReason: edge.node.returnReason || 'WRONG_SIZE',
//     }));

//     const returnResult = await createShopifyReturn({
//       orderId,
//       returnLineItems,
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         return: returnResult,
//       }),
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('[api.order.return] Error:', error);

//     return new Response(
//       JSON.stringify({
//         error: error.message || 'Failed to create return',
//       }),
//       { status: 500 }
//     );
//   }
// }
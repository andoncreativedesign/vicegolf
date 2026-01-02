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

    // Add debug logging here
    console.log('[API] Order ID:', orderId);
    console.log('[API] Returnable response:', JSON.stringify(returnableResponse.data, null, 2));

    const returnableFulfillments = returnableResponse.data?.data?.returnableFulfillments?.edges || [];
    const returnableLineItems = returnableFulfillments.flatMap((edge: any) =>
      edge.node?.returnableFulfillmentLineItems?.edges || []
    );

    console.log('[API] Parsed returnable items:', returnableLineItems.length);

    if (returnableLineItems.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No returnable items found for this order. Order may not be fulfilled yet.',
        }),
        { status: 400 }
      );
    }

    // Map the returnable items to the format needed for returnCreate
    const returnLineItems = returnableLineItems.map((edge: any) => ({
      fulfillmentLineItemId: edge.node.fulfillmentLineItem.id,
      quantity: edge.node.quantity,
      // returnReason: edge.node.returnReason || 'WRONG_SIZE',
      returnReason: 'SIZE_TOO_SMALL',
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
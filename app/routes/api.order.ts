// import type { ActionFunctionArgs } from 'react-router';
// import { CANCEL_ORDER } from '~/lib/shopify/order-query';
// import { axiosShopifyAdmin } from '~/utils/axiosInsatances';

// export async function action({ request }: ActionFunctionArgs) {
//   try {
//     const formData = await request.formData();

//     const orderId = formData.get('orderId')?.toString();
//     const reason = (formData.get('reason')?.toString() ?? 'CUSTOMER') as any;
//     const notifyCustomer = formData.get('notifyCustomer') === 'true';
//     const restock = formData.get('restock') !== 'false';
//     const staffNote = formData.get('staffNote')?.toString();

//     if (!orderId) {
//       return new Response(
//         JSON.stringify({ error: 'Order ID is required' }),
//         { status: 400 }
//       );
//     }

//     // ✅ orderId already contains full GID — DO NOT prefix again
//     const variables = {
//       orderId,
//       notifyCustomer,
//       restock,
//       reason,
//       staffNote,

//       // ✅ Correct 2025-10 refund method
//       refundMethod: {
//         originalPaymentMethodsRefund: true,
//       },
//     };

//     const response = await axiosShopifyAdmin.post('', {
//       query: CANCEL_ORDER,
//       variables,
//     });

//     const cancel = response.data?.data?.orderCancel;

//     if (
//       response.data?.errors?.length ||
//       cancel?.userErrors?.length ||
//       cancel?.orderCancelUserErrors?.length
//     ) {
//       return new Response(
//         JSON.stringify({
//           errors: [
//             ...(response.data.errors ?? []),
//             ...(cancel?.userErrors ?? []),
//             ...(cancel?.orderCancelUserErrors ?? []),
//           ],
//         }),
//         { status: 400 }
//       );
//     }

//     return new Response(
//       JSON.stringify({ job: cancel.job }),
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('Order cancel failed:', error);
//     return new Response(
//       JSON.stringify({
//         error: 'Failed to cancel order',
//         details: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }


import type { ActionFunctionArgs } from 'react-router';
import { CANCEL_ORDER } from '~/lib/shopify/order-query';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('orderId')?.toString();
    const staffNote = formData.get('staffNote')?.toString();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400 }
      );
    }

    const variables = {
      orderId,
      // staffNote:'Wrong size. Customer reached out saying they already re-purchased the correct size.',
      staffNote,
      notifyCustomer: true,
      restock: true,
      reason: 'CUSTOMER',
      refund: true, 
    };

    const response = await axiosShopifyAdmin.post('', {
      query: CANCEL_ORDER,
      variables,
    });

    const cancel = response.data?.data?.orderCancel;

    if (
      response.data?.errors?.length ||
      cancel?.userErrors?.length ||
      cancel?.orderCancelUserErrors?.length
    ) {
      return new Response(
        JSON.stringify({
          errors: [
            ...(response.data.errors ?? []),
            ...(cancel?.userErrors ?? []),
            ...(cancel?.orderCancelUserErrors ?? []),
          ],
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ job: cancel.job }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Order cancel failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to cancel order',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

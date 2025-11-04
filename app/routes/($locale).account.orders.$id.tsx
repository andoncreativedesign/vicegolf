import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  
  return (
    <div className="order-details">
      <div className="order-header">
        <h2>Order {order.name}</h2>
        <p className="order-date">Placed on {new Date(order.processedAt!).toDateString()}</p>
        {order.confirmationNumber && (
          <p className="confirmation">Confirmation: {order.confirmationNumber}</p>
        )}
      </div>

      <div className="order-items">
        <div className="order-items-container">
          <table className="order-items-table w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="text-left py-3 px-4 w-1/2 font-medium">Product</th>
                <th scope="col" className="text-right py-3 px-4 w-1/6 font-medium">Price</th>
                <th scope="col" className="text-center py-3 px-4 w-1/6 font-medium">Quantity</th>
                <th scope="col" className="text-right py-3 px-4 w-1/6 font-medium">Total</th>
              </tr>
            </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          </table>
        </div>
        
        <div className="order-summary mt-8">
          <table className="w-full max-w-md ml-auto">
            <tfoot className="text-right">
            {((discountValue && discountValue.amount) || discountPercentage) && (
              <tr>
                <td className="py-2 text-right">
                  {discountPercentage ? 'Discount' : 'Discounts'}:
                </td>
                <td className="py-2 pl-4 text-right font-medium">
                  {discountPercentage ? (
                    <span className="text-red-600">-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} className="text-red-600" />
                  )}
                </td>
              </tr>
            )}
            <tr className="order-totals-row">
              <th scope="row" colSpan={3} className="label">
                Subtotal
              </th>
              <td className="value">
                <Money data={order.subtotal!} />
              </td>
            </tr>
            <tr className="order-totals-row">
              <th scope="row" colSpan={3} className="label">
                Tax
              </th>
              <td className="value">
                <Money data={order.totalTax!} />
              </td>
            </tr>
            <tr className="order-totals-row total">
              <th scope="row" colSpan={3} className="label">
                Total
              </th>
              <td className="value">
                <Money data={order.totalPrice!} />
              </td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>

      <div className="order-address-section">
        <div className="shipping-address">
          <h3>Shipping Address</h3>
          <div className="address-details">
            {order?.shippingAddress ? (
              <address>
                <p className="name">{order.shippingAddress.name}</p>
                {order.shippingAddress.formatted && (
                  <p className="address">{order.shippingAddress.formatted}</p>
                )}
                {order.shippingAddress.formattedArea && (
                  <p className="area">{order.shippingAddress.formattedArea}</p>
                )}
              </address>
            ) : (
              <p>No shipping address defined</p>
            )}
          </div>
        </div>

        <div className="order-status-section">
          <h3>Status</h3>
          <div className="status-badge">
            {fulfillmentStatus}
          </div>
        </div>
      </div>

      <div className="order-actions">
        <a 
          target="_blank" 
          href={order.statusPageUrl} 
          rel="noreferrer"
          className="view-status-link"
        >
          View Order Status →
        </a>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr className="order-line-item border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4">
        <div className="flex items-center">
          {lineItem?.image && (
            <div className="flex-shrink-0 mr-4">
              <Image 
                data={lineItem.image} 
                width={64} 
                height={64}
                alt={lineItem.title || 'Product image'}
                className="h-16 w-16 rounded-md object-cover object-center"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{lineItem.title}</p>
            {lineItem.variantTitle && (
              <p className="text-sm text-gray-500">{lineItem.variantTitle}</p>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right align-top">
        <div className="text-gray-900">
          <Money data={lineItem.price!} />
        </div>
      </td>
      <td className="py-4 px-4 text-center align-top">
        <div className="text-gray-900">
          {lineItem.quantity}
        </div>
      </td>
      <td className="py-4 px-4 text-right align-top">
        <div className="font-medium text-gray-900">
          <Money data={lineItem.totalDiscount!} />
        </div>
      </td>
    </tr>
  );
}

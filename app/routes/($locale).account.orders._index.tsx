import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type { Route } from './+types/account.orders._index';
import { useRef } from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Orders' }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const { data, errors } = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return { customer: data.customer, filters };
}

export default function Orders() {
  const { customer, filters } = useLoaderData<OrdersLoaderData>();
  const { orders } = customer;

  return (
    <div className="orders w-full">
      {orders.nodes.length > 0 ? (
        <div className="bg-[#F5F5F5] p-8 min-h-[400px]">
          <OrderSearchForm currentFilters={filters} />
          <OrdersTable orders={orders} filters={filters} />
        </div>
      ) : (
        <div className="bg-[#F5F5F5] p-8 w-full min-h-[400px]">
          <EmptyOrders hasFilters={!!(filters.name || filters.confirmationNumber)} />
        </div>
      )}
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({ node: order }) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={true} />
      )}
    </div>
  );
}

function EmptyOrders({ hasFilters = false }: { hasFilters?: boolean }) {
  return (
    <div>
      {hasFilters ? (
        <>
          <p>No orders found matching your search.</p>
          <br />
          <p>
            <Link to="/account/orders">Clear filters →</Link>
          </p>
        </>
      ) : (
        <p className="text-gray-900 font-medium">No orders yet</p>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="order-search-form text-gray-700"
      aria-label="Search orders"
    >
      <fieldset className="order-search-fieldset">
        <legend className="order-search-legend">Filter Orders</legend>

        <div className="order-search-inputs">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="order-search-input"
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="order-search-input"
          />
        </div>

        <div className="order-search-buttons flex gap-4 mt-4">
          <button
            type="submit"
            disabled={isSearching}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Search Orders'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="order-item">
      <Link to={`/account/orders/${btoa(order.id)}`} className="order-item-link">
        <div className="order-item-content">
          <div className="order-item-details">
            <p className="order-number">Order {order.name}</p>
            <p className="order-date">Placed on {new Date(order.processedAt!).toDateString()}</p>
            <p className="order-total">
              <span>Total: </span>
              <Money data={order.totalPrice!} />
            </p>
            <p className="order-status">
              <span>Status: </span>
              {order.fulfillmentStatus}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import { useEffect, useState } from 'react';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  Link,
  Outlet,
  useActionData,
  useFetcher,
  useLocation,
  useNavigation,
  useNavigate,
  useOutletContext,
  type Fetcher,
  NavLink,
} from 'react-router';
import { CustomInputFiled } from '~/components/basic/CustomInputFiled';
import type { Route } from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import { AddressCard } from '~/components/Profile/AddressCard';
import { AddressForm } from '~/components/Profile/AddressForm';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Addresses' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        { error: { [addressId]: 'Unauthorized' } },
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return { error: null, deletedAddress: addressId };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          { error: { [addressId]: 'Method not allowed' } },
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        { error: error.message },
        {
          status: 400,
        },
      );
    }
    return data(
      { error },
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const { customer } = useOutletContext<{ customer: CustomerFragment }>();
  const { defaultAddress, addresses } = customer;
  const location = useLocation();
  const isFormRoute = /\/(add|update)(?:\/.+)?$/.test(location.pathname);

  // When we're on the add or update routes, render the nested form-only view
  if (isFormRoute) {
    return (
      <div className="max-w-3xl mx-auto">
        <Outlet />
      </div>
    );
  }

  // Otherwise, show the addresses list with the option to add a new one
  return (
    <div className="account-addresses" >
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Address</h2>
        <NavLink
          to="update"
          className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          style={{ textDecoration: 'none', color: "white" }}
        >
          Add new one
        </NavLink>
      </div>
      <br />
      <ExistingAddresses
        addresses={addresses}
        defaultAddress={defaultAddress}
      />
    </div>
  )
}


function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [removingId, setRemovingId] = useState<AddressFragment['id'] | null>(null);

  useEffect(() => {
    if (fetcher.state === 'idle') {
      setRemovingId(null);
    }
  }, [fetcher.state]);

  const handleEdit = (address: AddressFragment) => {
    navigate('update', {
      state: { address },
    });
  };

  const handleRemove = (address: AddressFragment) => {
    if (fetcher.state !== 'idle') return;
    setRemovingId(address.id);
    fetcher.submit(
      { addressId: address.id },
      { method: 'DELETE', action: '.' },
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {addresses.nodes.map((address) => {
          const isDefault = defaultAddress?.id === address.id;
          const isRemoving = removingId === address.id && fetcher.state !== 'idle';

          return (
            <div key={address.id} className="space-y-6 ">
              <AddressCard
                address={address}
                isDefault={isDefault}
                onEdit={() => handleEdit(address)}
                onRemove={() => handleRemove(address)}
                isRemoving={isRemoving}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

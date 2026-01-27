import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type { AddressFragment } from 'customer-accountapi.generated';
import { data, Form, useActionData, useNavigation, useLocation, useNavigate } from 'react-router';
import { CustomInputFiled } from '~/components/basic/CustomInputFiled';
import type { Route } from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import { useEffect, useState } from 'react';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
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
        try {
          const { data: response, errors } = await customerAccount.mutate(
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

          if (response?.customerAddressCreate?.userErrors?.length) {
            throw new Error(
              response?.customerAddressCreate?.userErrors[0].message,
            );
          }

          if (!response?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: response.customerAddressCreate.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          return data(
            { error: { [addressId]: message } },
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        try {
          const { data: response, errors } = await customerAccount.mutate(
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

          if (response?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(
              response?.customerAddressUpdate?.userErrors[0].message,
            );
          }

          if (!response?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: response.customerAddressUpdate.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          return data(
            { error: { [addressId]: message } },
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

type LocationState = {
  address?: AddressFragment | (CustomerAddressInput & { id?: AddressFragment['id'] | null });
} | null;

export default function AddressEditor() {
  const navigation = useNavigation();
  const action = useActionData<ActionResponse>();
  const location = useLocation();
  const locationState = (location.state ?? null) as LocationState;
  const addressFromState = locationState?.address ?? null;
  const navigate = useNavigate();

  // Store address data in state to preserve it during errors
  const [preservedAddress, setPreservedAddress] = useState<Partial<CustomerAddressInput> & { id?: AddressFragment['id'] | null } | null>(null);

  useEffect(() => {
    console.log('AddressEditor mounted', {
      pathname: location.pathname,
      state: location.state,
    });

    if (addressFromState) {
      console.log('Loaded address from navigation state', addressFromState);
      // Store the address data when it's available from navigation state
      setPreservedAddress(addressFromState);
    } else if (preservedAddress) {
      console.log('Using preserved address data', preservedAddress);
    } else {
      console.warn('No address found in navigation state. This can happen after a full page refresh.');
    }
  }, [addressFromState, location, preservedAddress]);

  useEffect(() => {
    if ((action?.createdAddress || action?.updatedAddress) && !action?.error) {
      navigate('..', { replace: true });
    }
  }, [action?.createdAddress, action?.updatedAddress, action?.error, navigate]);

  const isEditMode = Boolean(addressFromState?.id || preservedAddress?.id);
  const derivedAddress: Partial<CustomerAddressInput> & { id?: AddressFragment['id'] | null } =
    addressFromState ?? preservedAddress ?? {
      address1: '',
      address2: '',
      city: '',
      company: '',
      territoryCode: '',
      firstName: '',
      id: 'NEW_ADDRESS_ID',
      lastName: '',
      phoneNumber: '',
      zoneCode: '',
      zip: '',
    };

  const addressId = derivedAddress.id ?? 'NEW_ADDRESS_ID';
  const submitMethod = isEditMode ? 'PUT' : 'POST';
  const isSubmitting = navigation.state !== 'idle';
  const error = action?.error?.[addressId];

  return (
    <div className="account-profile w-full flex justify-center">
      <Form method="PUT" className="space-y-6 w-full lg:mx-8" style={{ maxWidth: '40rem' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit address' : 'Create address'}
        </h2>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <CustomInputFiled
          label="First name"
          aria-label="First name"
          autoComplete="given-name"
          defaultValue={derivedAddress.firstName ?? ''}
          id="firstName"
          name="firstName"
          placeholder="First name"
          required
          type="text"
        />
        <CustomInputFiled
          label="Last name"
          aria-label="Last name"
          autoComplete="family-name"
          defaultValue={derivedAddress.lastName ?? ''}
          id="lastName"
          name="lastName"
          placeholder="Last name"
          required
          type="text"
        />
        <CustomInputFiled
          label="Company"
          aria-label="Company"
          autoComplete="organization"
          defaultValue={derivedAddress.company ?? ''}
          id="company"
          name="company"
          placeholder="Company"
          type="text"
        />
        <CustomInputFiled
          label="Address line"
          aria-label="Address line 1"
          autoComplete="address-line1"
          defaultValue={derivedAddress.address1 ?? ''}
          id="address1"
          name="address1"
          placeholder="Address line 1"
          required
          type="text"
        />
        <CustomInputFiled
          label="Address line 2"
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={derivedAddress.address2 ?? ''}
          id="address2"
          name="address2"
          placeholder="Address line 2"
          type="text"
        />
        <CustomInputFiled
          label="City"
          aria-label="City"
          autoComplete="address-level2"
          defaultValue={derivedAddress.city ?? ''}
          id="city"
          name="city"
          placeholder="City"
          required
          type="text"
        />
        <CustomInputFiled
          label="State / Province"
          aria-label="State/Province"
          autoComplete="address-level1"
          defaultValue={derivedAddress.zoneCode ?? ''}
          id="zoneCode"
          name="zoneCode"
          placeholder="State / Province"
          required
          type="text"
        />
        <CustomInputFiled
          label="Zip / Postal Code"
          aria-label="Zip"
          autoComplete="postal-code"
          defaultValue={derivedAddress.zip ?? ''}
          id="zip"
          name="zip"
          placeholder="Zip / Postal Code"
          required
          type="text"
        />
        <CustomInputFiled
          label="Country Code"
          aria-label="territoryCode"
          autoComplete="country"
          defaultValue="AE"
          id="territoryCode"
          name="territoryCode"
          placeholder="Country"
          required
          type="text"
          maxLength={2}
          readOnly
          containerClassName="hidden"
        />
        <CustomInputFiled
          label="Phone"
          aria-label="Phone Number"
          autoComplete="tel"
          defaultValue={derivedAddress.phoneNumber ?? ''}
          id="phoneNumber"
          name="phoneNumber"
          placeholder="+16135551111"
          pattern="^\+?[1-9]\d{3,14}$"
          type="tel"
        />
        <div className="flex items-center">
          <input
            defaultChecked={Boolean(derivedAddress.defaultAddress)}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="h-4 w-4 text-gray-800 border-gray-300 rounded"
          />
          <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          formMethod={submitMethod}
          disabled={isSubmitting}
          className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Creating...'
            : isEditMode
              ? 'Save changes'
              : 'Create address'}
        </button>
      </Form>
    </div>
  );
}

import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import * as React from 'react';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useLoaderData,
  type Fetcher,
} from 'react-router';
import type { Route } from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import { createAddress } from '~/lib/shopify/profile';
import { PhoneInputField } from '~/components/basic/PhoneInputField';
import { CountrySelector } from '~/components/basic/CountrySelector';
import { COUNTRIES_QUERY } from '~/graphql/CountriesQuery';
import { useEffect, useState, useMemo } from 'react';

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

  try {
    const data = await context.storefront.query(COUNTRIES_QUERY);
    return {
      countries: data?.localization?.availableCountries || [],
    };
  } catch (error) {
    console.error('Failed to load countries:', error);
    return { countries: [] };
  }
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
        // handle new address creation using our profile client
        try {
          const { address: createdAddress, userErrors } = await createAddress(
            customerAccount,
            {
              address,
              defaultAddress,
              language: customerAccount.i18n.language,
            },
          );

          if (userErrors?.length) {
            throw new Error(userErrors[0].message);
          }

          if (!createdAddress) {
            throw new Error('Failed to create address');
          }

          return {
            error: null,
            createdAddress,
            defaultAddress,
            resetForm: true,  // Add this flag to indicate form should be reset
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
          return data(
            { error: { [addressId]: errorMessage } },
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
            updatedAddress: data?.customerAddressUpdate?.customerAddress,
            defaultAddress,
            resetForm: true,  // Add this flag to indicate form should be reset
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

// This is the component that will be rendered at /account/addresses/add
export default function AddAddress() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a new address</h2>
      <AddressForm
        addressId={'NEW_ADDRESS_ID'}
        address={newAddress}
        defaultAddress={null}
      >
        {({ stateForMethod }) => (
          <div className="mt-6">
            <button
              type="submit"
              formMethod="POST"
              disabled={stateForMethod('POST') !== 'idle'}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              {stateForMethod('POST') !== 'idle' ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        )}
      </AddressForm>
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a new address</h2>
      <AddressForm
        addressId={'NEW_ADDRESS_ID'}
        address={newAddress}
        defaultAddress={null}
      >
        {({ stateForMethod }) => (
          <div className="mt-6">
            <button
              type="submit"
              formMethod="POST"
              disabled={stateForMethod('POST') !== 'idle'}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              {stateForMethod('POST') !== 'idle' ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        )}
      </AddressForm>
    </div>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div>
      <legend>Existing addresses</legend>
      {addresses.nodes.map((address) => (
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({ stateForMethod }) => (
            <div>
              <button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
              >
                {stateForMethod('PUT') !== 'idle' ? 'Saving' : 'Save'}
              </button>
              <button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
              >
                {stateForMethod('DELETE') !== 'idle' ? 'Deleting' : 'Delete'}
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address: initialAddress,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput | AddressFragment;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const actionData = useActionData<{ resetForm?: boolean }>();

  // Reset form when resetForm flag is received
  React.useEffect(() => {
    if (actionData?.resetForm && formRef.current) {
      formRef.current.reset();
    }
  }, [actionData]);
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  const address = initialAddress; // Use the initialAddress prop as address

  const { countries } = useLoaderData<typeof loader>();
  const [phone, setPhone] = useState(address?.phoneNumber ?? '');
  const [selectedCountryCode, setSelectedCountryCode] = useState(address?.territoryCode || 'AE');

  const availableProvinces = useMemo(() => {
    const country = countries.find((c: any) => c.isoCode === selectedCountryCode);
    return country?.availableProvinces || [];
  }, [countries, selectedCountryCode]);

  const inputClasses = "w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Form id={addressId} ref={formRef}>
      <fieldset className="space-y-4">
        <input type="hidden" name="addressId" defaultValue={addressId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClasses}>First name *</label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClasses}>Last name *</label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className={labelClasses}>Company (optional)</label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            id="company"
            name="company"
            placeholder="Company"
            type="text"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="address1" className={labelClasses}>Address line 1 *</label>
          <input
            aria-label="Address line 1"
            autoComplete="address-line1"
            defaultValue={address?.address1 ?? ''}
            id="address1"
            name="address1"
            placeholder="Address line 1"
            required
            type="text"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="address2" className={labelClasses}>Address line 2 (optional)</label>
          <input
            aria-label="Address line 2"
            autoComplete="address-line2"
            defaultValue={address?.address2 ?? ''}
            id="address2"
            name="address2"
            placeholder="Address line 2"
            type="text"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className={labelClasses}>City *</label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="zip" className={labelClasses}>ZIP / Postal code *</label>
            <input
              aria-label="ZIP/Postal code"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="ZIP / Postal code"
              required
              type="text"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zoneCode" className={labelClasses}>State / Province *</label>
            {availableProvinces.length > 0 ? (
              <div className="relative">
                <select
                  id="zoneCode"
                  name="zoneCode"
                  defaultValue={address?.zoneCode ?? ''}
                  required
                  className={inputClasses + " appearance-none"}
                >
                  <option value="" disabled>Select region</option>
                  {availableProvinces.map((province: any) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            ) : (
              <input
                aria-label="State/Province"
                autoComplete="address-level1"
                defaultValue={address?.zoneCode ?? ''}
                id="zoneCode"
                name="zoneCode"
                placeholder="State / Province"
                required
                type="text"
                className={inputClasses}
              />
            )}
          </div>

          <CountrySelector
            label="Country"
            id="territoryCode"
            name="territoryCode"
            defaultValue={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClasses}>Phone (optional)</label>
          <PhoneInputField
            label="" // Label is already handled above
            id="phoneNumber-input"
            value={phone}
            onChange={(val) => setPhone(val || '')}
            placeholder="Enter phone number"
            autoComplete="tel"
            availableCountries={['AE']}
          />
          <input type="hidden" name="phoneNumber" value={phone} />
        </div>

        <div className="flex items-center">
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="h-4 w-4 text-gray-800 border-gray-300 rounded"
          />
          <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
      </fieldset>
      {children({
        stateForMethod: (method) => (formMethod === method ? state : 'idle'),
      })}
    </Form>
  );
}

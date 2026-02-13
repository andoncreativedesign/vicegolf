import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  Form,
  useActionData,
  useNavigation,
  type Fetcher,
} from 'react-router';
import { CustomInputFiled } from '~/components/basic/CustomInputFiled';
import { PhoneInputField } from '~/components/basic/PhoneInputField';
import { CountrySelector } from '~/components/basic/CountrySelector';
import { useState } from 'react';


export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  const [phone, setPhone] = useState(address?.phoneNumber ?? '');

  return (
    <Form id={addressId} className='text-gray-700'>
      <fieldset>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <CustomInputFiled
          label="First name"
          aria-label="First name"
          autoComplete="given-name"
          defaultValue={address?.firstName ?? ''}
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
          defaultValue={address?.lastName ?? ''}
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
          defaultValue={address?.company ?? ''}
          id="company"
          name="company"
          placeholder="Company"
          type="text"
        />
        <CustomInputFiled
          label="Address line"
          aria-label="Address line 1"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          id="address1"
          name="address1"
          placeholder="Address line 1*"
          required
          type="text"
        />
        <CustomInputFiled
          label="Address line 2"
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          id="address2"
          name="address2"
          placeholder="Address line 2"
          type="text"
        />
        <CustomInputFiled
          label="City"
          aria-label="City"
          autoComplete="address-level2"
          defaultValue={address?.city ?? ''}
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
          defaultValue={address?.zoneCode ?? ''}
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
          defaultValue={address?.zip ?? ''}
          id="zip"
          name="zip"
          placeholder="Zip / Postal Code"
          required
          type="text"
        />
        <CountrySelector
          label="Country"
          id="territoryCode"
          name="territoryCode"
          defaultValue={address?.territoryCode || 'AE'}
          required
        />
        <PhoneInputField
          label="Phone"
          id="phoneNumber-input"
          value={phone}
          onChange={(val) => setPhone(val || '')}
          placeholder="Enter phone number"
          autoComplete="tel"
          availableCountries={['AE']}
        />
        <input type="hidden" name="phoneNumber" value={phone} />
        <div>
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
          />
          <label htmlFor="defaultAddress" className="ml-2">Set as default address</label>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}

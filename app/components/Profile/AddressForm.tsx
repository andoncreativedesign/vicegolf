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

  const [selectedLabel, setSelectedLabel] = useState(() => {
    const comp = address?.company || '';
    if (['Home', 'Work'].includes(comp)) return comp;
    return comp ? 'Other' : '';
  });
  const [customLabel, setCustomLabel] = useState(() => {
    const comp = address?.company || '';
    return ['Home', 'Work'].includes(comp) ? '' : comp;
  });

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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Label</label>
          <div className="flex gap-2 mb-2">
            {['Home', 'Work'].map((label) => {
              const isActive = selectedLabel === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setSelectedLabel(label);
                  }}
                  className={`px-4 py-2 text-sm font-medium border rounded-full transition duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-750 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {label === 'Home' ? '🏠 Home' : '💼 Work'}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setSelectedLabel(selectedLabel === 'Other' ? '' : 'Other');
              }}
              className={`px-4 py-2 text-sm font-medium border rounded-full transition duration-150 cursor-pointer ${
                selectedLabel === 'Other'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-755 border-gray-300 hover:border-gray-400'
              }`}
            >
              📍 Other
            </button>
            {selectedLabel && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLabel('');
                  setCustomLabel('');
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition duration-150 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {selectedLabel === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom label (e.g. Gym, Parent's House)"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm bg-white text-gray-900"
              required
            />
          )}

          <input
            type="hidden"
            name="company"
            value={selectedLabel === 'Other' ? customLabel : selectedLabel}
          />
        </div>
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

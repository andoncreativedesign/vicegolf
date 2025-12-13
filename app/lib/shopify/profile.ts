import {CREATE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';

type CreateAddressInput = {
  address: CustomerAddressInput;
  defaultAddress?: boolean;
  language?: string;
};

export async function createAddress(
  customerAccount: any,
  input: CreateAddressInput,
) {
  const {address, defaultAddress = false, language} = input;

  try {
    const {data, errors} = await customerAccount.mutate(CREATE_ADDRESS_MUTATION, {
      variables: {
        address,
        defaultAddress,
        language: language || 'EN',
      },
    });

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (data?.customerAddressCreate?.userErrors?.length) {
      throw new Error(data.customerAddressCreate.userErrors[0].message);
    }

    if (!data?.customerAddressCreate?.customerAddress) {
      throw new Error('Failed to create address');
    }

    return {
      address: data.customerAddressCreate.customerAddress,
      userErrors: [],
    };
  } catch (error) {
    return {
      address: null,
      userErrors: [
        {
          message: error instanceof Error ? error.message : 'Failed to create address',
        },
      ],
    };
  }
}
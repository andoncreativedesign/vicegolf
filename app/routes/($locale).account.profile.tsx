import type { CustomerFragment } from 'storefrontapi.generated';
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation';

// Type for the customer update input
type CustomerUpdateInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

// Extend CustomerFragment to include email and phone
type ExtendedCustomerFragment = CustomerFragment & {
  email?: string;
  phone?: string;
};
import * as React from 'react';
import { data, Form, useActionData, useNavigation, useOutletContext } from 'react-router';
import type { Route } from './+types/account.profile';
import { SquareUserRoundIcon } from 'lucide-react'
import { CustomInputFiled } from '~/components/basic/CustomInputFiled';
import { axiosShopifyAdminCustomerApi } from '~/utils/axiosInsatances';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Profile' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  if (request.method !== 'PUT') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  // Check if user is logged in
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    console.error('User is not logged in');
    return data(
      { error: 'Please sign in to update your profile', customer: null },
      { status: 401 },
    );
  }

  const form = await request.formData();
  const formData = Object.fromEntries(form.entries()) as {
    customerId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  const { firstName, lastName, email, phone, customerId } = formData;
  const customerNumberId = customerId?.split('/').pop()?.split('Customer/').pop() || '';

  try {
    // First, update the name using Customer Account API if first name or last name is provided
    if (firstName !== undefined || lastName !== undefined) {
      const customerUpdateInput: { firstName?: string; lastName?: string } = {};

      if (firstName !== undefined) customerUpdateInput.firstName = firstName;
      if (lastName !== undefined) customerUpdateInput.lastName = lastName;

      console.log('Updating customer name with Customer Account API:', customerUpdateInput);

      try {
        const { data: nameUpdateData, errors: nameErrors } = await customerAccount.mutate(
          CUSTOMER_UPDATE_MUTATION,
          {
            variables: {
              input: customerUpdateInput,
            },
          },
        );

        if (nameErrors?.length) {
          console.error('Name Update GraphQL Errors:', JSON.stringify(nameErrors, null, 2));
          throw new Error(nameErrors[0].message || 'Failed to update name');
        }

        const nameUpdate = nameUpdateData?.customerUpdate;
        if (nameUpdate?.userErrors?.length) {
          console.error('Name Update Errors:', JSON.stringify(nameUpdate.userErrors, null, 2));
          const error = nameUpdate.userErrors[0];
          throw new Error(error.message || 'Failed to update name');
        }

        console.log('Successfully updated customer name');
      } catch (error: any) {
        console.error('Error updating customer name:', error);
        throw new Error(`Failed to update name: ${error.message}`);
      }
    }

    // Then, update email/phone using Admin API if provided
    if ((email || phone) && customerNumberId) {
      try {
        let formattedPhone = phone;
        if (phone && !phone.startsWith('+')) {
          if (phone.startsWith('0')) {
            // Convert UAE local 05x to +9715x
            formattedPhone = '+971' + phone.slice(1);
          } else {
            // Prepend + to numbers like 971xxxxxxx
            formattedPhone = '+' + phone;
          }
        }

        const customerData: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          verified_email: boolean;
          send_email_welcome: boolean;
        } = {
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          email: email || undefined,
          phone: formattedPhone || undefined,
          verified_email: true,
          send_email_welcome: false
        };

        // Log the request payload for debugging
        console.log('Updating customer contact info with Admin API:', {
          customerId: customerNumberId,
          data: customerData,
          url: `/customers/${customerNumberId}.json`
        });

        const response = await axiosShopifyAdminCustomerApi.put(
          `/customers/${customerNumberId}.json`,
          { customer: customerData },
          {
            validateStatus: (status) => status < 500 // Don't throw for 4xx errors
          }
        );

        console.log('Admin API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });

        if (response.status >= 400) {
          // Extract and format a user-friendly error message
          let errorMessage = 'Failed to update your information. ';

          if (response.data?.errors) {
            // Handle phone number validation specifically
            if (response.data.errors.phone) {
              errorMessage += 'Phone is invalid';
            } else {
              // Handle other validation errors
              const errorObj = response.data.errors;
              const errorMessages = Object.entries(errorObj).map(([field, errors]) => {
                const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const errorList = Array.isArray(errors) ? errors.join(', ') : String(errors);
                return `${fieldName}: ${errorList}`;
              });
              errorMessage += errorMessages.join('. ');
            }
          } else if (response.data?.error) {
            errorMessage += typeof response.data.error === 'string'
              ? response.data.error
              : 'An unknown error occurred';
          } else if (response.data?.message) {
            errorMessage += response.data.message;
          } else {
            errorMessage += 'Please check your information and try again.';
          }

          console.error('Admin API Error Details:', {
            status: response.status,
            error: response.data?.errors || response.data?.error || 'Unknown error',
            responseData: response.data
          });

          throw new Error(errorMessage.trim());
        }

        return {
          error: null,
          customer: response.data.customer,
        };
      } catch (error: any) {
        console.error('Error in Admin API call:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });
        throw new Error(`Failed to update contact information: ${error.message}`);
      }
    }

    return {
      error: null,
      customer: { email, firstName, lastName, phone },
    };
  } catch (error: any) {
    console.error('Profile update error:', {
      message: error.message,
      stack: error.stack,
    });

    return {
      error: error.message || 'An error occurred while updating your profile',
      customer: null,
    };
  }
}

export default function AccountProfile() {
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const { customer } = useOutletContext<{ customer: ExtendedCustomerFragment & CustomerFragment }>();

  // Debug: Log the customer data to see its structure
  React.useEffect(() => {
    console.log('Customer Data:', customer);
    console.log('Email from customer:', customer?.emailAddress?.emailAddress);
    console.log('First name from customer:', customer?.firstName);
    console.log('Last name from customer:', customer?.lastName);

    // Update form data when customer data changes
    if (customer) {
      const email = customer?.emailAddress?.emailAddress || customer?.email || '';
      const emailName = email.split('@')[0] || '';

      setFormData(prev => ({
        ...prev,
        email: email,
        firstName: customer?.firstName || emailName,
        lastName: customer?.lastName || '',
        phone: customer?.phoneNumber?.phoneNumber ?
          customer.phoneNumber.phoneNumber.replace('+', '') :
          prev.phone,
      }));
    }
  }, [customer]);

  // Get email and use its first part as a fallback name
  const email = customer?.emailAddress?.emailAddress || customer?.email || '';
  const emailName = email.split('@')[0] || '';

  const [formData, setFormData] = React.useState({
    email: email,
    phone: customer?.phoneNumber?.phoneNumber ? customer.phoneNumber.phoneNumber.replace('+', '') : '',
    firstName: customer?.firstName || emailName,
    lastName: customer?.lastName || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isDirty = React.useMemo(() => {
    const originalEmail = customer?.emailAddress?.emailAddress || customer?.email || '';
    const originalPhone = customer?.phoneNumber?.phoneNumber ? customer.phoneNumber.phoneNumber.replace('+', '') : '';
    const originalFirstName = customer?.firstName || '';
    const originalLastName = customer?.lastName || '';

    return (
      formData.firstName !== originalFirstName ||
      formData.lastName !== originalLastName ||
      formData.email !== originalEmail ||
      formData.phone !== originalPhone
    );
  }, [formData, customer]);

  return (
    <div className="account-profile w-full">
      <div className="bg-[#F5F5F5] p-10 w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-8">My details</h2>
        <Form method="PUT" className="space-y-6 w-full" style={{ maxWidth: '100%' }}>
          <fieldset className="space-y-4 w-full">
            <CustomInputFiled
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              minLength={2}
              required
            />

            <CustomInputFiled
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              minLength={2}
              required
            />

            <CustomInputFiled
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              placeholder="Email address"
              aria-label="Email address"
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              required
            />

            <CustomInputFiled
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
              placeholder="Phone number"
              aria-label="Phone number"
              pattern="[0-9]{10,15}"
              title="Please enter a valid phone number (10-15 digits)"
              required
            />
            <p className="text-xs text-gray-500 -mt-3 ml-1">Please enter your number as 971xxxxxxxxx or 050xxxxxxx (e.g. 0501234567)</p>

            <input type="hidden" name="customerId" value={customer?.id} />
          </fieldset>
          {action?.error && (
            <div className="mt-4 mb-6 w-full p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="text-sm">{action.error}</p>
            </div>
          )}
          {action && !action.error && action.customer && (
            <div className="mt-4 mb-6 w-full p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p className="text-sm">Profile updated successfully!</p>
            </div>
          )}
          <button
            type="submit"
            disabled={!isDirty || state !== 'idle'}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-full font-bold hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 text-sm tracking-wide"
          >
            {state !== 'idle' ? 'Saving' : 'Save changes'}
          </button>
        </Form>
      </div>
    </div>
  );
}
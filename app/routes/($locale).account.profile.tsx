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
  const { customerAccount, storefront } = context;

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
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  };
  const { firstName, lastName, email, phone, newPassword, confirmNewPassword } = formData;

  // Validate passwords match if provided
  if (newPassword && newPassword !== confirmNewPassword) {
    return data(
      { error: 'Passwords do not match', customer: null },
      { status: 400 },
    );
  }

  try {
    let updatedCustomer = null;

    // Update name fields using Customer Account API
    if ((firstName !== undefined && firstName.trim()) || (lastName !== undefined && lastName.trim())) {
      const customerUpdateInput: {
        firstName?: string;
        lastName?: string;
      } = {};
      
      if (firstName !== undefined && firstName.trim()) {
        customerUpdateInput.firstName = String(firstName).trim();
      }
      if (lastName !== undefined && lastName.trim()) {
        customerUpdateInput.lastName = String(lastName).trim();
      }

      console.log('Updating customer name with Customer Account API:', customerUpdateInput);
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

      updatedCustomer = nameUpdate?.customer;
    }

    // Update email/phone using Storefront API if provided
    if (email || phone) {
      const customerAccessToken = await customerAccount.getAccessToken();
      
      const storefrontUpdateInput: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string | null;
        acceptsMarketing?: boolean;
      } = {};
      
      // Include current name values to avoid overwriting
      if (updatedCustomer) {
        storefrontUpdateInput.firstName = updatedCustomer.firstName;
        storefrontUpdateInput.lastName = updatedCustomer.lastName;
      }
      
      if (email !== undefined && email.trim()) {
        storefrontUpdateInput.email = String(email).trim();
      }
      if (phone !== undefined) {
        storefrontUpdateInput.phone = phone.trim() ? String(phone).trim() : null;
      }
      
      storefrontUpdateInput.acceptsMarketing = false; // Default value

      console.log('Updating customer email/phone with Storefront API:', storefrontUpdateInput);
      
      // Create a Storefront API mutation for email/phone
      const STOREFRONT_CUSTOMER_UPDATE = `#graphql
        mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
          customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
            customer {
              id
              firstName
              lastName
              email
              phone
            }
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `;

      const { data: storefrontUpdateData, errors: storefrontErrors } = await storefront.mutate(
        STOREFRONT_CUSTOMER_UPDATE,
        {
          variables: {
            customerAccessToken,
            customer: storefrontUpdateInput,
          },
        },
      );

      if (storefrontErrors?.length) {
        console.error('Storefront Update GraphQL Errors:', JSON.stringify(storefrontErrors, null, 2));
        throw new Error(storefrontErrors[0].message || 'Failed to update email/phone');
      }

      const storefrontUpdate = storefrontUpdateData?.customerUpdate;
      
      if (storefrontUpdate?.customerUserErrors?.length) {
        console.error('Storefront Update Errors:', JSON.stringify(storefrontUpdate.customerUserErrors, null, 2));
        const error = storefrontUpdate.customerUserErrors[0];
        throw new Error(error.message || 'Failed to update email/phone');
      }

      if (storefrontUpdate?.customer) {
        updatedCustomer = storefrontUpdate.customer;
      }
    }

    if (newPassword) {
      console.log('Password update is not supported via Customer Account API');
      // You could implement password reset flow here if needed
    }

    return {
      error: null,
      customer: updatedCustomer,
    };
  } catch (error: any) {
    console.error('Profile update error:', {
      message: error.message,
      stack: error.stack,
    });
    
    return data(
      { error: error.message || 'An error occurred while updating your profile', customer: null },
      { status: 400 },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const { customer } = useOutletContext<{ customer: ExtendedCustomerFragment }>();
  const [formData, setFormData] = React.useState({
    email: customer?.emailAddress?.emailAddress || '',
    phone: customer?.phone || '',
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
  });

  // Debug: Log customer data
  React.useEffect(() => {
    console.log('Customer data in profile:', customer);
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="account-profile">
      <h2>My details</h2>
      <br />
      <Form method="PUT" className="space-y-6">
        <legend>Personal information</legend>
        <fieldset className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="font-semibold">First name</label>
            <div className="relative">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                aria-label="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                minLength={2}
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="lastName" className="font-semibold">Last name</label>
            <div className="relative">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                aria-label="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                minLength={2}
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="font-semibold">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                aria-label="Email address"
                value={formData.email}
                onChange={handleInputChange}
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="font-semibold">Phone Number</label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone number"
                aria-label="Phone number"
                value={formData.phone}
                onChange={handleInputChange}
                pattern="[0-9]{10,15}"
                title="Please enter a valid phone number (10-15 digits)"
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="newPassword" className="font-semibold">New Password</label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="New password"
                aria-label="New password"
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmNewPassword" className="font-semibold">Confirm New Password</label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                aria-label="Confirm new password"
                minLength={8}
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>
        </fieldset>
        {action?.error && (
          <div className="mt-4 mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="text-sm">{action.error}</p>
          </div>
        )}
        {action && !action.error && action.customer && (
          <div className="mt-4 mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p className="text-sm">Profile updated successfully!</p>
          </div>
        )}
        <button
          type="submit"
          disabled={state !== 'idle'}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
        >
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}

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
  const { storefront, customerAccount } = context;

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
  
  // Get customer data
  const { data: customerData } = await customerAccount.query(`#graphql
    query CustomerDetails {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
    }
  `);
  
  console.log("customerData")
  console.log(customerData)

  if (!customerData?.customer) {
    console.error('Failed to fetch customer data');
    return data(
      { error: 'Failed to load customer data', customer: null },
      { status: 400 },
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
    // Prepare customer update input according to Storefront API requirements
    const customerUpdateInput: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
      acceptsMarketing?: boolean;
    } = {};
    
    if (firstName !== undefined) customerUpdateInput.firstName = String(firstName);
    if (lastName !== undefined) customerUpdateInput.lastName = String(lastName);
    if (email !== undefined) customerUpdateInput.email = String(email);
    if (phone !== undefined) customerUpdateInput.phone = phone ? String(phone) : null;
    
    // Include acceptsMarketing if needed (default to current value or false)
    customerUpdateInput.acceptsMarketing = customerData?.customer?.acceptsMarketing || false;

    // Make a single API call to update all fields
    console.log('Updating customer with data:', customerUpdateInput);
    const { data: updateData, errors } = await storefront.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customerAccessToken: await customerAccount.getAccessToken(),
          customer: customerUpdateInput,
        },
      },
    );
    
    console.log('Update response:', JSON.stringify(updateData, null, 2));

    if (errors?.length) {
      console.error('GraphQL Errors:', JSON.stringify(errors, null, 2));
      throw new Error(errors[0].message || 'Failed to update profile');
    }

    const customerUpdate = updateData?.customerUpdate;
    
    if (customerUpdate?.customerUserErrors?.length) {
      console.error('Customer Update Errors:', JSON.stringify(customerUpdate.customerUserErrors, null, 2));
      const error = customerUpdate.customerUserErrors[0];
      throw new Error(error.message || 'Failed to update profile');
    }

    if (!customerUpdate?.customer) {
      throw new Error('Failed to update customer profile');
    }

    // Update the customer access token in session if a new one was returned
    if (customerUpdate.customerAccessToken?.accessToken) {
      await session.set('customerAccessToken', customerUpdate.customerAccessToken.accessToken);
    }

    // Note: Password updates would typically be handled through a separate API call
    // to update the customer's password in Shopify.
    // This would require additional backend implementation.
    if (newPassword) {
      console.log('Password update would happen here (requires implementation)');
    }

    return {
      error: null,
      customer: customerUpdate.customer,
    };
  } catch (error: any) {
    console.error('Profile update error:', {
      message: error.message,
      stack: error.stack,
      response: error.response,
      request: error.request,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      },
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
    email: customer.email || '',
    phone: customer.phone || '',
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
  });

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

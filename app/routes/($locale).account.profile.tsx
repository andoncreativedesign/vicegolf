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
    customerId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  };

  const customerId = formData.customerId;
  const { firstName, lastName, email, phone, newPassword, confirmNewPassword } = formData;
  console.log("\n\ncustomerId ", customerId)

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
      const { env } = context;
      const customerNumberId = customerId?.split('/').pop()?.split('Customer/').pop() || ''
      // const ADMIN_ACCESS_TOKEN = env.ADMIN_ACCESS_TOKEN; // set in .env file
      // const ADMIN_API_URL = `${env.ADMIN_API_URL}/customers/${customerNumberId}.json`;
      const ADMIN_ACCESS_TOKEN = 'REMOVED_TOKEN'
      const ADMIN_API_URL = `https://tzasu4-jj.myshopify.com/admin/api/2025-01/customers/${customerNumberId}.json`

      const res = await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          customer: {
            id: customerNumberId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
          },
        }),
      })

      const data = await res.json()
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

  // Debug: Log the customer data to see its structure
  React.useEffect(() => {
    console.log('Customer Data:', JSON.stringify(customer, null, 2));
  }, [customer]);
  const [formData, setFormData] = React.useState({
    email: customer?.emailAddress?.emailAddress || customer?.email || '',
    phone: customer?.phoneNumber?.phoneNumber || '',
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="account-profile w-full flex justify-center">
      <Form method="PUT" className="space-y-6 w-full lg:mx-8" style={{ maxWidth: '40rem' }}>
        <h2>My details</h2>
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

          <CustomInputFiled
            label="New Password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            aria-label="New password"
            minLength={8}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
          />

          <CustomInputFiled
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            minLength={8}
          />

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
          disabled={state !== 'idle'}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
        >
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}
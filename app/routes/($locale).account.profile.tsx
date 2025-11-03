import type { CustomerFragment } from 'customer-accountapi.generated';
import type { CustomerUpdateInput } from '@shopify/hydrogen/customer-account-api-types';
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
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
  const { customerAccount } = context;

  if (request.method !== 'PUT') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName', 'email', 'phone'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const { data, errors } = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      { error: error.message, customer: null },
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="account-profile">
      <h2>My details</h2>
      <br />
      <Form method="PUT">
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
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                required
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
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                required
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
                defaultValue={customer.email ?? ''}
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                required
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
                defaultValue={customer.phone ?? ''}
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
        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <br />
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

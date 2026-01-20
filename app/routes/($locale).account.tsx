import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useFetcher,
} from 'react-router';
import { useState, useEffect } from 'react';
import type { Route } from './+types/account';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { SquareUserIcon, HouseIcon, Package2Icon, HomeIcon, LogOutIcon, TicketPercentIcon } from 'lucide-react'
import { GET_CUSTOMER_AND_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';


export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { customerAccount, env } = context;
  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });



  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  // Check if the customer has already requested membership by checking tags
  let membershipRequested = false;
  let isPlusMember = false;
  let discountDetails = null;

  if (env.ADMIN_API_URL && env.ADMIN_ACCESS_TOKEN) {
    try {
      const adminApiUrl = `${env.ADMIN_API_URL}/graphql.json`;

      const response = await fetch(adminApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: GET_CUSTOMER_AND_DISCOUNT_QUERY,
          variables: {
            id: data.customer.id,
            discountQuery: 'code:plus-member-discount-code'
          },
        }),
      });

      const responseData = (await response.json()) as any;
      const tags = responseData.data?.customer?.tags || [];

      if (tags.includes('membership_requested')) {
        membershipRequested = true;
      }

      // Check if user is a Plus Member (assuming tag 'Plus Member')
      if (tags.some((tag: string) => tag.toLowerCase() === 'plus member' || tag.toLowerCase() === 'plus_member')) {
        isPlusMember = true;
      }

      const discountNode = responseData.data?.codeDiscountNodes?.nodes[0]?.codeDiscount;
      if (discountNode && discountNode.status === 'ACTIVE') {
        discountDetails = {
          code: discountNode.codes.nodes[0].code,
          percentage: (discountNode.customerGets.value.percentage * 100).toFixed(0)
        };
        console.log('Discount Details:', discountDetails);
      }

    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  }

  return remixData(
    { customer: data.customer, membershipRequested, isPlusMember, discountDetails },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount, env } = context;

  if (request.method !== 'POST') {
    return remixData({ error: 'Method not allowed' }, { status: 405 });
  }

  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (errors?.length || !data?.customer?.id) {
    return remixData({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.ADMIN_API_URL || !env.ADMIN_ACCESS_TOKEN) {
    console.error('Admin API configuration missing');
    return remixData({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const adminApiUrl = `${env.ADMIN_API_URL}/graphql.json`;
    const tagsAddMutation = `#graphql
      mutation tagsAdd($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          userErrors {
            field
            message
          }
          node {
            id
          }
        }
      }
    `;

    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': env.ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: tagsAddMutation,
        variables: {
          id: data.customer.id,
          tags: ['membership_requested'],
        },
      }),
    });

    const responseJson = await response.json();

    if (responseJson.data?.tagsAdd?.userErrors?.length > 0) {
      console.error('Tag add errors:', responseJson.data.tagsAdd.userErrors);
      return remixData({ error: 'Failed to update status' }, { status: 400 });
    }

    return remixData({ success: true });
  } catch (error) {
    console.error('Action error:', error);
    return remixData({ error: 'Internal server error' }, { status: 500 });
  }
}

export default function AccountLayout() {
  const {
    customer,
    membershipRequested: initialMembershipRequested,
    isPlusMember,
    discountDetails
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const heading = 'My Vice Golf Account';

  // Get email and use its first part as a fallback name
  const email = customer?.emailAddress?.emailAddress || '';
  const emailName = email.split('@')[0] || 'User';

  // Calculate names with fallbacks
  const firstName = customer?.firstName || emailName;
  const lastName = customer?.lastName || '';

  // Calculate initials safely
  const initials = (
    (firstName?.[0] || '') + (lastName?.[0] || '')
  ).toUpperCase() || emailName[0].toUpperCase();

  const fullName = `${firstName} ${lastName}`.trim() || emailName;

  const isSubmitting = fetcher.state !== 'idle';
  const isSuccess = fetcher.data?.success;
  const hasRequested = initialMembershipRequested || isSuccess;

  return (
    <div className="account w-full px-4 sm:px-6 lg:px-8 py-12 max-w-[1440px] mx-auto">
      <div className="flex justify-center items-center mb-12 gap-4">
        <h1 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: '48px' }}>{heading}</h1>

        <fetcher.Form method="post">
          <button
            type="submit"
            disabled={hasRequested || isSubmitting}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${hasRequested
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Requesting...
              </span>
            ) : hasRequested ? (
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Requested
              </span>
            ) : (
              'Request Membership'
            )}
          </button>
        </fetcher.Form>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-[35%] flex-shrink-0">
          {/* User Info Box */}
          <div className="bg-[#F5F5F5] p-6 flex items-center gap-5 mb-8">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-medium tracking-wider">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 leading-tight mb-1" style={{ fontSize: '1.5rem' }}>Hello</p>
              <p className="font-semibold text-gray-900 leading-tight truncate mb-1" style={{ fontSize: '1.5rem' }}>{fullName}</p>
              <p className="text-gray-500 truncate" style={{ fontSize: '0.9375rem' }}>{email}</p>
            </div>
          </div>

          <AccountMenu />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[65%]">
          <Outlet context={{ customer }} />
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const menuItems = [
    { to: '/account/orders', label: 'My orders', icon: <Package2Icon className="w-5 h-5" /> },
    { to: '/account/profile', label: 'My details', icon: <SquareUserIcon className="w-5 h-5" /> },
    { to: '/account/addresses', label: 'My addresses', icon: <HomeIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="flex flex-col w-full">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/account/orders' ? false : true}
          style={{ textDecoration: 'none' }}
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-10 text-base transition-colors duration-200 border-l-[3px] w-full no-underline hover:no-underline ${isActive
              ? 'bg-[#E5E5E5] font-bold text-gray-600 border-gray-900'
              : 'bg-[#F5F5F5] text-gray-600 hover:text-gray-900 border-transparent'
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form
      method="POST"
      action="/account/logout"
      className="contents"
    >
      <button type="submit" className="flex w-full items-center gap-4 px-6 py-10 text-gray-600 hover:text-gray-900 bg-[#F5F5F5] border-l-[3px] border-transparent text-left text-base transition-colors duration-200 no-underline hover:no-underline">
        <LogOutIcon className="w-5 h-5" />
        Sign out
      </button>
    </Form>
  );
}









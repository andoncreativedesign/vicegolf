import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/account';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { SquareUserIcon, HouseIcon, Package2Icon, HomeIcon, LogOutIcon } from 'lucide-react'

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    { customer: data.customer },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer?.firstName
    ? `Welcome, ${customer.firstName}`
    : 'Welcome to your account.';

  return (
    <div className="account max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center w-full">{heading}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="rounded-sm p-4 bg-[#f0f0f0]">
            <h2 className="text-lg font-medium mb-6">My Account</h2>
            <AccountMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-[#f0f0f0] p-6">
            <Outlet context={{ customer }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const menuItems = [
    { to: '/account/orders', label: 'Orders', icon: <Package2Icon /> },
    { to: '/account/profile', label: 'My details', icon: <SquareUserIcon /> },
    { to: '/account/addresses', label: 'Addresses', icon: <HomeIcon /> },
  ];

  return (
    <nav className="space-y-2 text-gray-700">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `block px-4 py-2 text-sm font-medium ${isActive
              ? 'text-gray-900 border-l-2 border-gray-800'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`
          }
          style={{ textDecoration: 'none' }}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
        </NavLink>
      ))}
      <div className="p-4 mt-4 border-t border-gray-200">
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <button
        type="submit"
        className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
      >
        <LogOutIcon />
        Sign out
      </button>
    </Form>
  );
}

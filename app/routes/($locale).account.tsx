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
    <div className="account w-full px-4 sm:px-6 lg:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center w-full">{heading}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-4/12 flex-shrink-0">
          <div className="rounded-sm p-4 bg-[#f0f0f0]">
            <h2 className="text-lg font-medium mb-6">My Account</h2>
            <AccountMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-8/12">
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
    { to: '/account/orders', label: 'My Orders', icon: <Package2Icon /> },
    { to: '/account/profile', label: 'My Details', icon: <SquareUserIcon /> },
    { to: '/account/addresses', label: 'My Addresses', icon: <HomeIcon /> },
  ];

  return (
    <nav className="space-y-2 text-gray-700">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `block px-4 py-8 text-sm font-medium ${isActive
              ? 'text-gray-900 border-l-2 border-gray-800 bg-gray-200'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`
          }
          style={{ textDecoration: 'none' }}
        >
          <span className="flex items-center gap-2 text-gray-900 text-lg">
            {item.icon}
            {item.label}
          </span>
        </NavLink>
      ))}
      <div className="w-full block px-4 py-8 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 text-left hover:border-gray-800 transition-colors duration-200">
      <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
      <Form
        method="POST"
        action="/account/logout"
      >
        <button type="submit">
          <span className="flex items-center gap-2 text-gray-900 text-lg">
            <LogOutIcon />
            Sign out
          </span>
        </button>
      </Form>
  );
}

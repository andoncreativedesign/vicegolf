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

  const heading = 'My Vice Golf Account';

  // Calculate initials safely
  const firstName = customer?.firstName || '';
  const lastName = customer?.lastName || '';
  const initials = (
    (firstName?.[0] || '') + (lastName?.[0] || '')
  ).toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim() || 'Guest';
  const email = customer?.email || '';

  return (
    <div className="account w-full px-4 sm:px-6 lg:px-8 py-12 max-w-[1440px] mx-auto">
      <h1 className="font-bold text-gray-900 mb-12 text-center w-full tracking-tight" style={{ fontSize: '48px' }}>{heading}</h1>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-[35%] flex-shrink-0">
          {/* User Info Box */}
          <div className="bg-[#F5F5F5] p-6 flex items-center gap-5 mb-8">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-medium tracking-wider">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-gray-900 font-medium mb-1">Hello</p>
              <p className="font-bold text-gray-900 text-lg leading-tight truncate mb-1">{fullName}</p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
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

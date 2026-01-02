import { Link, redirect } from 'react-router';
import type { Route } from './+types/account_.login';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Login | Vice Golf' }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  // Check if user is already logged in
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  if (isLoggedIn) {
    // Redirect to account page if already logged in
    return redirect('/account');
  }

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  // Handle the login action by redirecting to Shopify OAuth
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img
              src="/vice_logo.svg"
              alt="Vice Golf"
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        {/* <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/account/register"
            className="font-medium text-gray-900 hover:text-gray-700 underline"
          >
            create a new account
          </Link>
        </p> */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Primary Login Button */}
          <form method="POST" className="space-y-6">
            <div className="space-y-4">
              <button
                type="submit"
                className="flex w-full justify-center items-center rounded-md border border-transparent bg-gray-900 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Continue with Shopify Account
              </button>

              <p className="text-xs text-center text-gray-500">
                Secure authentication powered by Shopify
              </p>
            </div>
          </form>



          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms-of-service" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back to Store Link */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          ← Back to Vice Golf Store
        </Link>
      </div>
    </div>
  );
}
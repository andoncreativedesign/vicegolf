import { Link } from 'react-router';
import type { Route } from './+types/account_.register';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Create Account | Vice Golf' }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  // Check if user is already logged in
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  if (isLoggedIn) {
    // Redirect to account page if already logged in
    return Response.redirect('/account');
  }

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  // Handle the registration action by redirecting to Shopify OAuth
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}

export default function Register() {
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/account/login"
            className="font-medium text-gray-900 hover:text-gray-700 underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Registration Form */}
          <form method="POST" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="First name"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Last name"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm your password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-500">
                I agree to the{' '}
                <Link to="/pages/terms" className="underline hover:text-gray-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/pages/privacy" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-500">
                Subscribe to our newsletter for exclusive offers and updates
              </label>
            </div>

            {/* Info Message */}
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Secure Registration with Shopify
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      For your security, we use Shopify's secure authentication system. 
                      Click "Create Account with Shopify" to continue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Registration Options (Placeholder) */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 cursor-not-allowed opacity-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>

              <button
                type="button"
                disabled
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 cursor-not-allowed opacity-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Why create an account?</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Track your orders and delivery status</li>
              <li>• Save your favorite products</li>
              <li>• Faster checkout process</li>
              <li>• Exclusive member offers and early access</li>
              <li>• Manage your addresses and preferences</li>
            </ul>
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
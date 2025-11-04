import { Link } from 'react-router';
import type { Route } from './+types/account_.login';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Login | Vice Golf' }];
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
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/account/register"
            className="font-medium text-gray-900 hover:text-gray-700 underline"
          >
            create a new account
          </Link>
        </p>
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Continue with Shopify Account
              </button>
              
              <p className="text-xs text-center text-gray-500">
                Secure authentication powered by Shopify
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or sign in with email</span>
              </div>
            </div>
          </div>

          {/* Traditional Login Form */}
          <form method="POST" className="mt-6 space-y-6">
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
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-gray-900 hover:text-gray-700 underline"
                  onClick={() => alert('Password reset functionality would be implemented here')}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Info Message */}
          <div className="mt-6 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  New to Vice Golf?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Both login methods will redirect you to our secure Shopify authentication system 
                    where you can sign in or create a new account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <form method="POST">
                <input type="hidden" name="provider" value="google" />
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
              </form>

              <form method="POST">
                <input type="hidden" name="provider" value="facebook" />
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/pages/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/pages/privacy" className="underline hover:text-gray-700">
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

import { Link, data, useActionData, useNavigation } from 'react-router';
import { useState } from 'react';

export const meta = () => {
  return [{ title: 'Create Account | Vice Golf' }];
};

type ActionResponse = {
  error?: string;
  success?: boolean;
  validationErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  };
};

export async function loader({ context }: any) {
  // Check if user is already logged in
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  if (isLoggedIn) {
    // Redirect to account page if already logged in
    return Response.redirect('/account');
  }

  return {};
}

export async function action({ request, context }: any) {
  const formData = await request.formData();

  // Check if this is a social login request
  const provider = formData.get('provider') as string;
  if (provider) {
    // Handle social login (Google, Facebook, etc.)
    try {
      return context.customerAccount.login({
        countryCode: context.storefront.i18n.country,
      });
    } catch (error) {
      console.error('Social login error:', error);
      return data(
        { error: 'Social login is not available at the moment. Please try the regular registration form.' },
        { status: 500 }
      );
    }
  }

  // Handle regular form registration
  const firstName = (formData.get('firstName') as string) || '';
  const lastName = (formData.get('lastName') as string) || '';
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';
  const confirmPassword = (formData.get('confirmPassword') as string) || '';
  const acceptTerms = formData.get('acceptTerms') as string;
  const newsletter = formData.get('newsletter') as string;

  // Validation
  const validationErrors: ActionResponse['validationErrors'] = {};

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
    validationErrors.firstName = 'First name must be at least 2 characters';
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
    validationErrors.lastName = 'Last name must be at least 2 characters';
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    validationErrors.email = 'Please enter a valid email address';
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    validationErrors.password = 'Password must be at least 8 characters';
  }

  if (password !== confirmPassword) {
    validationErrors.confirmPassword = 'Passwords do not match';
  }

  if (!acceptTerms) {
    validationErrors.acceptTerms = 'You must accept the terms and conditions';
  }

  // If there are validation errors, return them
  if (Object.keys(validationErrors).length > 0) {
    return data(
      { validationErrors, error: 'Please fix the errors below' },
      { status: 400 }
    );
  }

  try {
    // Store registration data in session for use after OAuth
    if (context.session) {
      await context.session.set('registrationData', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        newsletter: !!newsletter,
      });
    }

    // Redirect to Shopify OAuth for secure account creation
    return context.customerAccount.login({
      countryCode: context.storefront.i18n.country,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return data(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}

export default function Register() {
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
          {/* Error Message */}
          {actionData?.error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{actionData.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${actionData?.validationErrors?.firstName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                      }`}
                  />
                  {actionData?.validationErrors?.firstName && (
                    <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.firstName}</p>
                  )}
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${actionData?.validationErrors?.lastName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                      }`}
                  />
                  {actionData?.validationErrors?.lastName && (
                    <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.lastName}</p>
                  )}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${actionData?.validationErrors?.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                    }`}
                />
                {actionData?.validationErrors?.email && (
                  <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.email}</p>
                )}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${actionData?.validationErrors?.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                    }`}
                />
                {actionData?.validationErrors?.password && (
                  <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${actionData?.validationErrors?.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                    }`}
                />
                {actionData?.validationErrors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className={`h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 ${actionData?.validationErrors?.acceptTerms ? 'border-red-300' : ''
                    }`}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/pages/terms" className="underline hover:text-gray-900">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/pages/privacy" className="underline hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {actionData?.validationErrors?.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{actionData.validationErrors.acceptTerms}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
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
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
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

            {/* Social Registration Options */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <form method="POST">
                <input type="hidden" name="provider" value="google" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
              </form>

              <form method="POST">
                <input type="hidden" name="provider" value="facebook" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </form>
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
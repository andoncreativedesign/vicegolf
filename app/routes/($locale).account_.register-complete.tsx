import { Link, useLoaderData } from 'react-router';

export const meta = () => {
  return [{ title: 'Registration Complete | Vice Golf' }];
};

export async function loader({ context }: any) {
  // Check if user is logged in
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return Response.redirect('/account/login');
  }

  // Get registration data from session
  const session = context.session;
  const registrationData = await session.get('registrationData');
  
  // Clear the registration data from session
  if (registrationData) {
    await session.unset('registrationData');
  }

  return { registrationData };
}

export default function RegisterComplete() {
  const { registrationData } = useLoaderData<typeof loader>();

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
        
        {/* Success Icon */}
        <div className="flex justify-center mt-6">
          <div className="rounded-full bg-green-100 p-3">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to Vice Golf!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your account has been created successfully
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Welcome Message */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Created Successfully!
            </h3>
            
            {registrationData && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Welcome, {registrationData.firstName} {registrationData.lastName}!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Account created for: {registrationData.email}
                </p>
                {registrationData.newsletter && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Subscribed to newsletter
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You can now enjoy all the benefits of being a Vice Golf member:
              </p>
              
              <ul className="text-xs text-gray-600 space-y-2 text-left">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track your orders and delivery status
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save your favorite products
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Faster checkout process
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exclusive member offers and early access
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Manage your addresses and preferences
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              to="/account"
              className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
            >
              Go to My Account
            </Link>
            
            <Link
              to="/"
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Special Offer */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Welcome Offer
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Get 10% off your first order with code <strong>WELCOME10</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
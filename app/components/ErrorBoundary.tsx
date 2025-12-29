import { useRouteError, isRouteErrorResponse, Link, useRouteLoaderData, useLocation } from 'react-router';
import { PageLayout } from './PageLayout';
import type { Route } from '~/+types/root';

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  const data = useRouteLoaderData('root') as Route.LoaderData;
  let errorMessage = 'Unknown error';
  let errorStatus = 404;
  let pageTitle = "Something Went Wrong";

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Set contextual error messages based on the current path
  if (location.pathname.startsWith('/account')) {
    pageTitle = errorStatus === 404 ? 'Account Not Found' : 'Account Error';
    errorMessage = errorMessage || 'We encountered an issue with your account. Please try again or contact support.';
  } else if (location.pathname.startsWith('/cart')) {
    pageTitle = 'Something’s wrong here.  ';
    errorMessage = errorMessage || 'We found an error while loading this page.';
  } else if (location.pathname.startsWith('/products')) {
    pageTitle = errorStatus === 404 ? 'We’ve lost this product' : 'Product Error';
    errorMessage = errorMessage || 'The product you are looking for cannot be found or is no longer available.';
  } else if (errorStatus === 404) {
    pageTitle = "We’ve lost this page";
    errorMessage = errorMessage || "We couldn't find the page you're looking for.";
  }
  return (
    <PageLayout
      cart={data?.cart}
      footer={data?.footer}
      header={data?.header}
      isLoggedIn={data?.isLoggedIn}
      publicStoreDomain={data?.publicStoreDomain}
    >
      <div className="flex h-full w-full flex-col   min-h-[60vh] px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full ">
    <h1 className="text-4xl sm:text-5xl md:text-6xl w-full font-bold mb-4 md:mb-6 leading-tight"
          style={{ fontSize: '3.2rem', color: '#1d1d1f' }}>
            {pageTitle}
          </h1>
          <p className="mb-8 text-xl text-gray-600"style={{ color: '#3e3e40' }}>
            {errorMessage}<br/>Try checking the URL or heading back to the home page.
          </p>
          <div className='pt-4 sm:pt-7'>
            <Link
            to="/"
            className="inline-block  rounded-full px-8 py-4 text-base font-normal text-gray-700 border border-gray-500 duration-200"
            style={{ color: '#3e3e40',textDecoration: 'none' }}
          >
            Take me to the home page
          </Link>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}
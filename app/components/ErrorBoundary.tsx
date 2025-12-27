import { useRouteError, isRouteErrorResponse, Link, useRouteLoaderData } from 'react-router';
import { PageLayout } from './PageLayout';
import type { Route } from '~/+types/root';

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData('root') as Route.LoaderData;
  let errorMessage = 'Unknown error';
  let errorStatus = 404;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  

  return (
    <PageLayout
      cart={data?.cart}
      footer={data?.footer}
      header={data?.header}
      isLoggedIn={data?.isLoggedIn}
      publicStoreDomain={data?.publicStoreDomain}
    >
      <div className="flex h-full w-full flex-col items-center justify-center  px-8 py-16">
        <div className="max-w-md ">
          <h1 className="text-4xl md:text-5xl h-[30px] font-bold text-main-700 mb-4">
            {errorStatus === 404 ? "We've lost this page" : "Something Went Wrong"}
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            {errorMessage || "We couldn't find the page you're looking for. Try checking the URL or heading back to the home page."}
          </p>
          <Link
            to="/"
            className="inline-block rounded-full px-6 py-3 text-sm font-medium text-white border border-main-900 hover:bg-main-900 hover:text-white transition-colors duration-200"
          >
            Take me to the home page
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
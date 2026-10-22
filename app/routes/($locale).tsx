import { redirect, type LoaderFunctionArgs } from 'react-router';
import type { I18nLocale } from '~/lib/i18n';

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {language, country, pathPrefix} = context.storefront.i18n as I18nLocale;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are at the default locale
    // then the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  // If URL has no locale prefix AND the active locale has a regional prefix (e.g. SA, OM, QA),
  // redirect to that regional prefix. For UAE (pathPrefix: ''), root path IS canonical — no redirect.
  if (!params.locale && pathPrefix) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api') && !url.pathname.endsWith('.xml')) {
      const targetPath = url.pathname === '/' ? pathPrefix : `${pathPrefix}${url.pathname}`;
      return redirect(`${targetPath}${url.search}`);
    }
  }

  return null;
}

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

  // If URL has no locale prefix, redirect uniformly to the active regional prefix (/en-ae, /en-sa, /en-om)
  if (!params.locale) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api') && !url.pathname.endsWith('.xml')) {
      const prefix = pathPrefix || '/en-ae';
      const targetPath = url.pathname === '/' ? prefix : `${prefix}${url.pathname}`;
      return redirect(`${targetPath}${url.search}`);
    }
  }

  return null;
}

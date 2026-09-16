import type {I18nBase} from '@shopify/hydrogen';

export type SupportedCountry = 'AE' | 'SA' | 'OM';
export type SupportedLanguage = 'EN';

export interface CountryConfig {
  code: SupportedCountry;
  name: string;
  language: SupportedLanguage;
  currency: 'AED' | 'SAR' | 'OMR';
  symbol: string;
  decimals: number;
  pathPrefix: string;
  phoneCode: string;
  phoneDigits: number;
}

export const COUNTRIES: Record<SupportedCountry, CountryConfig> = {
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'EN',
    currency: 'AED',
    symbol: 'AED',
    decimals: 2,
    pathPrefix: '/en-ae',
    phoneCode: '+971',
    phoneDigits: 9,
  },
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    language: 'EN',
    currency: 'SAR',
    symbol: 'SAR',
    decimals: 2,
    pathPrefix: '/en-sa',
    phoneCode: '+966',
    phoneDigits: 9,
  },
  OM: {
    code: 'OM',
    name: 'Oman',
    language: 'EN',
    currency: 'OMR',
    symbol: 'OMR',
    decimals: 3,
    pathPrefix: '/en-om',
    phoneCode: '+968',
    phoneDigits: 8,
  },
};

export const COUNTRIES_LIST = Object.values(COUNTRIES);

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
  country: SupportedCountry;
  language: SupportedLanguage;
  currency: 'AED' | 'SAR' | 'OMR';
}

export const DEFAULT_LOCALE: I18nLocale = {
  language: 'EN',
  country: 'AE',
  pathPrefix: '/en-ae',
  currency: 'AED',
};

export function parseCookie(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const items = cookieHeader.split(';');
  for (const item of items) {
    const [rawKey, ...rawVal] = item.trim().split('=');
    if (rawKey) {
      cookies[rawKey] = decodeURIComponent(rawVal.join('='));
    }
  }
  return cookies;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toLowerCase() ?? '';

  // 1. Resolve from URL market prefix (/en-ae, /en-sa, /en-om)
  if (firstPathPart === 'en-sa') {
    return { language: 'EN', country: 'SA', pathPrefix: '/en-sa', currency: 'SAR' };
  }
  if (firstPathPart === 'en-om') {
    return { language: 'EN', country: 'OM', pathPrefix: '/en-om', currency: 'OMR' };
  }
  if (firstPathPart === 'en-ae') {
    return { language: 'EN', country: 'AE', pathPrefix: '/en-ae', currency: 'AED' };
  }

  // 2. Resolve from saved cookie
  const cookies = parseCookie(request.headers.get('Cookie'));
  const savedCountry = cookies['vice_country']?.toUpperCase() as SupportedCountry | undefined;
  if (savedCountry && COUNTRIES[savedCountry]) {
    return {
      language: 'EN',
      country: savedCountry,
      pathPrefix: COUNTRIES[savedCountry].pathPrefix,
      currency: COUNTRIES[savedCountry].currency,
    };
  }

  // 3. Fallback to default GCC locale (UAE)
  return DEFAULT_LOCALE;
}

/**
 * Builds a localized path for a given country code
 */
export function buildLocalizedUrl(pathname: string, countryCode: SupportedCountry): string {
  const cleanPath = pathname.replace(/^\/en-(ae|sa|om)(\/|$)/i, '/');
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const prefix = COUNTRIES[countryCode]?.pathPrefix || '/en-ae';
  return `${prefix}${normalized === '/' ? '' : normalized}`;
}

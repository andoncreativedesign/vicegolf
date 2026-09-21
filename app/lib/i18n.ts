import type {I18nBase} from '@shopify/hydrogen';

export type SupportedCountry = 'AE' | 'SA' | 'OM' | 'QA';
export type SupportedLanguage = 'EN';

export interface CountryConfig {
  code: SupportedCountry;
  name: string;
  language: SupportedLanguage;
  currency: 'AED' | 'SAR' | 'OMR' | 'QAR';
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
  QA: {
    code: 'QA',
    name: 'Qatar',
    language: 'EN',
    currency: 'QAR',
    symbol: 'QAR',
    decimals: 2,
    pathPrefix: '/en-qa',
    phoneCode: '+974',
    phoneDigits: 8,
  },
};

export const COUNTRIES_LIST = Object.values(COUNTRIES);

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
  country: SupportedCountry;
  language: SupportedLanguage;
  currency: 'AED' | 'SAR' | 'OMR' | 'QAR';
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

  // 1. Resolve from URL market prefix (/en-ae, /en-sa, /en-om, /en-qa)
  if (firstPathPart === 'en-sa') {
    return { language: 'EN', country: 'SA', pathPrefix: '/en-sa', currency: 'SAR' };
  }
  if (firstPathPart === 'en-om') {
    return { language: 'EN', country: 'OM', pathPrefix: '/en-om', currency: 'OMR' };
  }
  if (firstPathPart === 'en-qa') {
    return { language: 'EN', country: 'QA', pathPrefix: '/en-qa', currency: 'QAR' };
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
  const cleanPath = pathname.replace(/^\/en-(ae|sa|om|qa)(\/|$)/i, '/');
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const prefix = COUNTRIES[countryCode]?.pathPrefix || '/en-ae';
  return `${prefix}${normalized === '/' ? '' : normalized}`;
}

export const GCC_PROVINCES: Record<string, { code: string; name: string }[]> = {
  AE: [
    { code: 'DU', name: 'Dubai' },
    { code: 'AZ', name: 'Abu Dhabi' },
    { code: 'SH', name: 'Sharjah' },
    { code: 'AJ', name: 'Ajman' },
    { code: 'RK', name: 'Ras Al Khaimah' },
    { code: 'FU', name: 'Fujairah' },
    { code: 'UQ', name: 'Umm Al Quwain' }
  ],
  SA: [
    { code: '01', name: 'Riyadh' },
    { code: '02', name: 'Makkah' },
    { code: '03', name: 'Madinah' },
    { code: '04', name: 'Eastern Province' },
    { code: '05', name: 'Qassim' },
    { code: '06', name: "Ha'il" },
    { code: '07', name: 'Tabuk' },
    { code: '08', name: 'Northern Borders' },
    { code: '09', name: 'Jizan' },
    { code: '10', name: 'Najran' },
    { code: '11', name: 'Al Bahah' },
    { code: '12', name: 'Al Jawf' },
    { code: '14', name: 'Asir' }
  ],
  OM: [
    { code: 'DA', name: 'Ad Dakhiliyah' },
    { code: 'ZA', name: 'Ad Dhahirah' },
    { code: 'BS', name: 'Al Batinah North' },
    { code: 'BJ', name: 'Al Batinah South' },
    { code: 'BU', name: 'Al Buraimi' },
    { code: 'WU', name: 'Al Wusta' },
    { code: 'SS', name: 'Ash Sharqiyah North' },
    { code: 'SJ', name: 'Ash Sharqiyah South' },
    { code: 'DH', name: 'Dhofar' },
    { code: 'MA', name: 'Muscat' },
    { code: 'MU', name: 'Musandam' }
  ],
  QA: [
    { code: 'DA', name: 'Doha' },
    { code: 'RA', name: 'Al Rayyan' },
    { code: 'WA', name: 'Al Wakrah' },
    { code: 'ZA', name: 'Al Daayen' },
    { code: 'KH', name: 'Al Khor' },
    { code: 'SH', name: 'Al Shamal' },
    { code: 'US', name: 'Umm Salal' },
    { code: 'SN', name: 'Al Sheehaniya' }
  ]
};

/**
 * Formats city and province before submitting to Shopify.
 * For UAE (AE), Shopify natively supports zones (e.g. Dubai -> DU).
 * For SA, OM, and QA, Shopify does not persist zoneCode, so we append the province to the city field if not already included.
 */
export function formatAddressCityAndZone(
  territoryCode: string = 'AE',
  city: string = '',
  zoneCode?: string | null
): { city: string; zoneCode?: string } {
  const trimmedCity = (city || '').trim();
  const trimmedZone = (zoneCode || '').trim();

  if (!trimmedZone || territoryCode === 'AE') {
    return { city: trimmedCity, zoneCode: trimmedZone || undefined };
  }

  // If city doesn't already include the province name, append it
  if (!trimmedCity.toLowerCase().includes(trimmedZone.toLowerCase())) {
    return {
      city: trimmedCity ? `${trimmedCity}, ${trimmedZone}` : trimmedZone,
      zoneCode: trimmedZone,
    };
  }

  return { city: trimmedCity, zoneCode: trimmedZone };
}

/**
 * Parses raw city and zoneCode from a saved Shopify address.
 * Resolves province from native zoneCode (UAE) or extracts it from the city field (SA, OM).
 */
export function parseAddressCityAndZone(
  territoryCode: string = 'AE',
  rawCity: string = '',
  rawZoneCode?: string | null
): { cleanCity: string; selectedProvince: string } {
  const trimmedCity = (rawCity || '').trim();
  const provinces = GCC_PROVINCES[territoryCode] || [];

  // 1. If native zoneCode is available (e.g. UAE 'DU' or 'Dubai')
  if (rawZoneCode) {
    const match = provinces.find(
      (p) => p.code === rawZoneCode || p.name.toLowerCase() === rawZoneCode.toLowerCase()
    );
    return {
      cleanCity: trimmedCity,
      selectedProvince: match ? match.name : rawZoneCode,
    };
  }

  // 2. If zoneCode is not set (e.g. SA, OM, QA where Shopify ignores it), parse from city
  if (trimmedCity && provinces.length > 0) {
    // Check if city ends with ", <ProvinceName>" or "- <ProvinceName>"
    for (const p of provinces) {
      const regex = new RegExp(`[,\\-]\\s*${p.name}$`, 'i');
      if (regex.test(trimmedCity)) {
        return {
          cleanCity: trimmedCity.replace(regex, '').trim(),
          selectedProvince: p.name,
        };
      }
    }

    // Check if the city itself matches a province name exactly
    const exact = provinces.find(
      (p) => p.name.toLowerCase() === trimmedCity.toLowerCase()
    );
    if (exact) {
      return {
        cleanCity: exact.name,
        selectedProvince: exact.name,
      };
    }
  }

  return {
    cleanCity: trimmedCity,
    selectedProvince: '',
  };
}

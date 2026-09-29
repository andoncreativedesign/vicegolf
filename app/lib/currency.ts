/**
 * Regional Currency Configuration and Storefront API Transformer.
 * 
 * Provides centralized currency conversion rates for GCC expansion (UAE, Saudi Arabia, Oman)
 * and intercepts GraphQL responses at the network layer in app/lib/context.ts.
 * 
 * FUTURE-PROOF FOR SHOPIFY MARKETS:
 * When Shopify Markets is enabled in Admin and returns native 'SAR' or 'OMR' currency codes,
 * transformPrices automatically bypasses conversion (only converts when currencyCode === 'AED').
 */

export interface CurrencyRateConfig {
  rate: number;
  currency: 'AED' | 'SAR' | 'OMR' | 'QAR';
  decimals: number;
  name: string;
}

export const REGIONAL_CURRENCY_RATES: Record<'AE' | 'SA' | 'OM' | 'QA', CurrencyRateConfig> = {
  AE: { rate: 1.0, currency: 'AED', decimals: 2, name: 'UAE Dirham' },
  SA: { rate: 1.03, currency: 'SAR', decimals: 2, name: 'Saudi Riyal' },       // From Google: 1 AED = 1.03 SAR
  OM: { rate: 0.1047, currency: 'OMR', decimals: 3, name: 'Omani Rial' },     // From Google graph: 1 AED = 0.1047 OMR
  QA: { rate: 0.99, currency: 'QAR', decimals: 2, name: 'Qatari Riyal' },     // Pegged rate: 1 AED = 0.99 QAR
};

/**
 * Recursively traverses GraphQL responses and converts any MoneyV2 objects
 * ({ amount: string, currencyCode: string }) from AED to the target country's currency.
 */
export function transformPrices(data: any, targetCountry: string): any {
  if (!data || typeof data !== 'object') return data;
  
  const country = targetCountry?.toUpperCase() as 'AE' | 'SA' | 'OM' | 'QA';
  if (country === 'AE' || !REGIONAL_CURRENCY_RATES[country]) {
    return data;
  }

  const { rate, currency, decimals } = REGIONAL_CURRENCY_RATES[country];

  // If array, map each item
  if (Array.isArray(data)) {
    return data.map((item) => transformPrices(item, targetCountry));
  }

  // Check if this object is a Shopify MoneyV2 object with amount and currencyCode
  if (
    typeof data.amount === 'string' &&
    typeof data.currencyCode === 'string' &&
    data.currencyCode === 'AED'
  ) {
    const rawAmount = parseFloat(data.amount);
    if (!isNaN(rawAmount)) {
      const converted = (rawAmount * rate).toFixed(decimals);
      return {
        ...data,
        amount: converted,
        currencyCode: currency,
      };
    }
  }

  // Check if this object has raw numeric minVariantPrice (e.g. Sanity or custom priceRange)
  let updatedData = data;
  if (typeof data.minVariantPrice === 'number') {
    updatedData = {
      ...updatedData,
      minVariantPrice: parseFloat((data.minVariantPrice * rate).toFixed(decimals)),
    };
  } else if (typeof data.minVariantPrice === 'string') {
    const raw = parseFloat(data.minVariantPrice);
    if (!isNaN(raw)) {
      updatedData = {
        ...updatedData,
        minVariantPrice: (raw * rate).toFixed(decimals),
      };
    }
  }

  // Recursively process nested object properties
  const result: Record<string, any> = {};
  for (const key of Object.keys(updatedData)) {
    result[key] = transformPrices(updatedData[key], targetCountry);
  }
  return result;
}

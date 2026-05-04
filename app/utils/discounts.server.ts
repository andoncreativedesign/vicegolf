import { createAxiosShopifyAdmin } from './axiosInsatances';
import { GET_CODE_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';

export type Discount = {
  collections: string[];
  products: string[];
  percentage: number;
  amount: { amount: string, currencyCode: string } | null;
  appliesToAll: boolean;
};

const discountCache: Record<string, Discount> = {};
const cacheMeta: Record<string, number> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches discount details from Shopify Admin API with in-memory caching.
 * @param code The discount code to fetch.
 * @returns The discount details or null if not found or inactive.
 */
export async function getDiscount(code: string, env: any): Promise<Discount | null> {
  const now = Date.now();

  // Check cache and TTL
  if (discountCache[code] && now - (cacheMeta[code] || 0) < CACHE_TTL) {
    console.log(`[Cache Hit] Discount code: ${code}`);
    return discountCache[code];
  }

  try {
    const axiosShopifyAdmin = createAxiosShopifyAdmin(env);
    const response = await axiosShopifyAdmin.post('', {
      query: GET_CODE_DISCOUNT_QUERY,
      variables: { code }
    });

    const node = response.data?.data?.codeDiscountNodeByCode;
    if (!node || node.codeDiscount?.status !== 'ACTIVE') {
      return null;
    }

    const codeDiscount = node.codeDiscount;
    const value = codeDiscount.customerGets?.value;
    const items = codeDiscount.customerGets?.items;

    const discount: Discount = {
      collections: items?.collections?.nodes?.map((c: any) => c.id) || [],
      products: items?.products?.nodes?.map((p: any) => p.id) || [],
      percentage: value?.percentage ?? 0,
      amount: value?.amount || null,
      appliesToAll: items?.__typename === 'AllDiscountItems',
    };

    // Store in cache
    discountCache[code] = discount;
    cacheMeta[code] = now;

    console.log(`[Cache Miss] Discount code: ${code} fetched and cached.`);
    return discount;
  } catch (error) {
    console.error('Error fetching discount from Shopify:', error);
    return null;
  }
}

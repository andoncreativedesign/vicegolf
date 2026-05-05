import { createAxiosShopifyAdmin } from './axiosInsatances';
import { GET_CODE_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';

export type Discount = {
  collections: string[];
  products: string[];
  percentage: number;
  amount: { amount: string, currencyCode: string } | null;
  appliesToAll: boolean;
};


/**
 * Fetches discount details from Shopify Admin API.
 * @param code The discount code to fetch.
 * @returns The discount details or null if not found or inactive.
 */
export async function getDiscount(code: string, env: any): Promise<Discount | null> {

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

    console.log(`[Shopify Admin API] Discount code: ${code} fetched.`);
    return discount;
  } catch (error) {
    console.error('Error fetching discount from Shopify:', error);
    return null;
  }
}

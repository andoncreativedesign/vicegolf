import { useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';

/**
 * usePlusMember Hook
 * 
 * Fetches the customer's membership status and the current automatic discount percentage
 * from the root loader data. Since root data is awaited in the loader, this is available
 * immediately on the client without extra promises.
 */
export function usePlusMember() {
  const data = useRouteLoaderData<RootLoader>('root');

  const customer = data?.customer;
  const plusDiscount = data?.plusDiscount;
  const automaticDiscounts = (data as any)?.automaticDiscounts || [];

  // Determine if tagged as a plus member
  const tags = (customer as any)?.tags || [];
  const isPlusMember = tags.some(
    (tag: string) =>
      tag.toLowerCase() === 'plus member' ||
      tag.toLowerCase() === 'plus_member'
  );

  // Discount percentage (fallback to 0 if nothing is set)
  let discountPercentage = 0;
  let discountAmount = 0;

  if (plusDiscount) {
    // Check for percentage (strict check for number might fail if serialization box it, or if it's 0)
    if (plusDiscount.percentage !== null && plusDiscount.percentage !== undefined) {
      discountPercentage = Number(plusDiscount.percentage);
    }

    // Check for amount if percentage is 0 or not present
    if (discountPercentage === 0 && plusDiscount.amount !== null && plusDiscount.amount !== undefined) {
      discountAmount = Number(plusDiscount.amount);
    }
  }

  /**
   * Helper to find the best discount for a specific product
   */
  const getBestDiscountForProduct = (productId?: string, collections?: string[], basePrice?: number) => {
    if (!automaticDiscounts || automaticDiscounts.length === 0) {
      return { percentage: discountPercentage, amount: discountAmount };
    }

    const plusMemberDiscountTitle = 'Plus Member Discount';

    // Filter discounts that apply to this product
    const applicableDiscounts = automaticDiscounts.filter((d: any) => {
      // 1. Check if it specifically applies to this product or its collections
      const isProductEligible = productId && d.eligibleProducts?.includes(productId);
      const isCollectionEligible = collections && collections.some(cId => d.eligibleCollections?.includes(cId));
      
      if (isProductEligible || isCollectionEligible) {
        return true;
      }

      // 2. If it's a Plus Member specific discount, only include if user is a member
      if (d.title === plusMemberDiscountTitle) {
        return isPlusMember && d.appliesToAll;
      }

      // 3. Otherwise, return if it applies to all 
      return d.appliesToAll;
    });

    // Sort by actual savings if basePrice is provided, otherwise fallback to rough sorting
    const sorted = applicableDiscounts.sort((a: any, b: any) => {
      if (basePrice) {
        const savingsA = a.amount ? a.amount : (a.percentage ? basePrice * a.percentage : 0);
        const savingsB = b.amount ? b.amount : (b.percentage ? basePrice * b.percentage : 0);
        return savingsB - savingsA;
      }
      
      // If no price, prioritize specific titles or higher values
      // (This is less accurate but better than nothing)
      const valA = a.amount || (a.percentage ? a.percentage * 100 : 0);
      const valB = b.amount || (b.percentage ? b.percentage * 100 : 0);
      return valB - valA;
    });

    if (sorted.length > 0) {
      const best = sorted[0];
      return {
        percentage: best.percentage,
        amount: best.amount,
        title: best.title
      };
    }

    // Fallback to the default calculated discount
    return { percentage: discountPercentage, amount: discountAmount };
  };

  // Debugging logs
  if (typeof document !== 'undefined') { // Only log on client to avoid server-side noise if double rendering
    // console.log('usePlusMember debug:', { isPlusMember, plusDiscount, discountPercentage, discountAmount, automaticDiscounts });
  }

  return { isPlusMember, discountPercentage, discountAmount, plusDiscount, automaticDiscounts, getBestDiscountForProduct };
}

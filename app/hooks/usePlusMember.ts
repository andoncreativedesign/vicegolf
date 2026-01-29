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

  // Debugging logs
  if (typeof document !== 'undefined') { // Only log on client to avoid server-side noise if double rendering
    console.log('usePlusMember debug:', { isPlusMember, plusDiscount, discountPercentage, discountAmount });
  }

  return { isPlusMember, discountPercentage, discountAmount, plusDiscount };
}

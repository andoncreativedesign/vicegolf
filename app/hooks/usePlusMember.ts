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
    if (typeof plusDiscount.percentage === 'number') {
      discountPercentage = plusDiscount.percentage;
    } else if (typeof plusDiscount.amount === 'number') {
      discountAmount = plusDiscount.amount;
      // We set percentage to 0 if we have a fixed amount, 
      // components should check discountAmount if they want to support it.
      discountPercentage = 0; 
    }
  }

  return { isPlusMember, discountPercentage, discountAmount, plusDiscount };
}

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
  const rawPercentage = data?.plusDiscountPercentage;

  // Determine if tagged as a plus member
  const tags = (customer as any)?.tags || [];
  const isPlusMember = tags.some(
    (tag: string) => 
      tag.toLowerCase() === 'plus member' || 
      tag.toLowerCase() === 'plus_member'
  );

  // Discount percentage (fallback to 5%)
  const discountPercentage = typeof rawPercentage === 'number' ? rawPercentage : 0.05;

  return { isPlusMember, discountPercentage };
}

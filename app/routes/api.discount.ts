import { getDiscount } from '~/utils/discounts.server';
import type { Route } from "../+types/root";

export async function loader() {
  return { message: "API Discount route is visible" };
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    console.log('>>> [API Discount] STARTING ACTION (Localized)');
    const formData = await request.formData();
    const code = formData.get('code');
    console.log('>>> [API Discount] Received code:', code);
    
    if (!code) {
      console.log('>>> [API Discount] No code provided, returning null');
      return { discount: null };
    }

    const { env } = context;
    console.log('>>> [API Discount] Calling getDiscount...');
    const discount = await getDiscount(code.toString(), env);
    console.log('>>> [API Discount] getDiscount finished. Result:', !!discount);
    
    return { discount: discount || null };
  } catch (error) {
    console.error('API Discount Action Error:', error);
    return { discount: null, error: 'Internal Server Error' };
  }
}

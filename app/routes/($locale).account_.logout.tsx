import { redirect } from 'react-router';
import type { Route } from './+types/account_.logout';

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader() {
  return redirect('/');
}

export async function action({ context }: Route.ActionArgs) {
  // Execute the standard Shopify logout which returns a redirect response
  const response = await context.customerAccount.logout();

  // Hydrogen stores the cart ID in a standalone browser cookie named 'cart'.
  // By explicitly setting Max-Age=0, we force the browser to delete it so the guest user gets a fresh cart.
  response.headers.append('Set-Cookie', 'cart=; Max-Age=0; Path=/');

  // Also clear from our session object just in case it was stored there
  context.session.unset('cartId');
  context.session.unset('cart');

  return response;
}

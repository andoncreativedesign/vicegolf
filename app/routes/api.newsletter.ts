import type { ActionFunctionArgs } from 'react-router';
import { processNewsletterSignup } from '~/lib/shopify/newsletter.server';

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const formData = await request.formData();
    const name = (formData.get('name') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim().toLowerCase() || '';

    // Validation
    if (!name) {
      return Response.json(
        { success: false, error: 'Please enter your name.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return Response.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Call Shopify Admin API:
    // If user exists: updates marketingState to SUBSCRIBED, attaches name if missing, adds tag
    // If user does not exist: auto-creates account with firstName/lastName, sets SUBSCRIBED, adds tag
    const result = await processNewsletterSignup(
      email,
      'global_footer',
      'newsletter_global',
      context.env,
      name
    );

    if (result.success) {
      return Response.json({
        success: true,
        action: result.action,
        message: 'Thank you for subscribing to our newsletter!',
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || 'Failed to process newsletter signup. Please try again.',
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('API Newsletter error:', err);
    return Response.json(
      {
        success: false,
        error: err.message || 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

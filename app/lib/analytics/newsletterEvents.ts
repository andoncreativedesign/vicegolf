/**
 * Global footer newsletter analytics helpers.
 * Pushes events to window.dataLayer (GTM) and fires fbq (Facebook Pixel) directly.
 * Matches the exact campaign specification with form_location: 'global_footer'.
 */

type FormLocation = 'global_footer';

function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(event);
}

function fireFbq(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (typeof (window as any).fbq !== 'function') return;
  (window as any).fbq('track', eventName, params);
}

export const globalNewsletterTrack = {
  /**
   * Fires when the user first focuses into the name or email input.
   */
  formStart(form_location: FormLocation = 'global_footer') {
    pushDataLayer({
      event: 'campaign_form_start',
      form_location,
    });
  },

  /**
   * Fires when the user clicks the submit button (before server response).
   */
  submitAttempt(form_location: FormLocation = 'global_footer') {
    pushDataLayer({
      event: 'campaign_form_submit_attempt',
      form_location,
    });
  },

  /**
   * Fires when the submission fails validation (invalid/missing email or name).
   */
  invalidEmail(form_location: FormLocation = 'global_footer') {
    pushDataLayer({
      event: 'campaign_invalid_email',
      form_location,
    });
  },

  /**
   * Fires on successful newsletter signup.
   * Matches the exact event requested:
   * { event: 'newsletter_signup', form_location: 'global_footer' }
   */
  signupSuccess(form_location: FormLocation = 'global_footer') {
    pushDataLayer({
      event: 'newsletter_signup',
      form_location,
    });
    fireFbq('Lead', {
      content_name: 'Global Newsletter Signup',
      content_category: 'Newsletter',
      form_location,
    });
  },

  /**
   * Fires when the user is already subscribed.
   */
  alreadySubscribed(form_location: FormLocation = 'global_footer') {
    pushDataLayer({
      event: 'campaign_already_registered',
      form_location,
    });
  },
};

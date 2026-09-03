/**
 * Campaign page analytics helpers.
 * Pushes events to window.dataLayer (GTM) and fires fbq (Facebook Pixel) directly.
 */

type FormLocation = 'newsletter_landing_page' | 'newsletter_landing_page_bottom';

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

export const campaignTrack = {
  /**
   * Fired once when the campaign page mounts.
   * Only called from the TOP form (SignupSection) to avoid duplicates.
   */
  pageView() {
    pushDataLayer({ event: 'campaign_page_view', page_type: 'newsletter_landing_page' });
    fireFbq('ViewContent', { content_name: 'Campaign Newsletter Signup' });
  },

  /**
   * Fired the first time a user focuses the email input (form engagement start).
   */
  formStart(form_location: FormLocation) {
    pushDataLayer({ event: 'campaign_form_start', form_location });
  },

  /**
   * Fired when the user clicks the submit button (before the server responds).
   */
  submitAttempt(form_location: FormLocation) {
    pushDataLayer({ event: 'campaign_form_submit_attempt', form_location });
  },

  /**
   * Fired when the server returns an email-validation error.
   */
  invalidEmail(form_location: FormLocation) {
    pushDataLayer({ event: 'campaign_invalid_email', form_location });
  },

  /**
   * Fired on successful newsletter signup.
   * Uses the exact event name requested by Faris.
   */
  signupSuccess(form_location: FormLocation) {
    pushDataLayer({ event: 'newsletter_signup', form_location });
    fireFbq('Lead', { content_name: 'Newsletter Signup', form_location });
  },

  /**
   * Fired when the page loads and the user is already registered.
   */
  alreadyRegistered(form_location: FormLocation) {
    pushDataLayer({ event: 'campaign_already_registered', form_location });
  },
};

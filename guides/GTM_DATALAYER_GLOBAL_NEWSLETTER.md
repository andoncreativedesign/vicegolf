# Global Footer Newsletter — Tracking & GTM Specification

## 1. Overview
This document specifies the analytics tracking events and customer tagging implemented for the **Global Footer Newsletter** on the Vice Golf Hydrogen storefront.

- **Form Location identifier**: `global_footer`
- **Shopify Customer Tag**: `newsletter_global`
- **Marketing Status**: `Email: Subscribed`

---

## 2. Shopify Customer Integration

When a user submits the newsletter in the global footer:
1. A customer record is created or updated in Shopify Admin.
2. **Tag Applied**: `newsletter_global` *(exclusive single tag; does not pollute campaign tags)*.
3. **Email Marketing Consent**: Set to `SUBSCRIBED` (`SINGLE_OPT_IN`).
4. **Name**: Populates `firstName` and `lastName` if provided.

---

## 3. Google Tag Manager (GTM) DataLayer Events

All events are pushed to `window.dataLayer` with the standard format.

### Event 1: Form Engagement Start
Fires the first time a user focuses into the "Your Name" or "Type in your email" input.

```javascript
window.dataLayer.push({
  event: 'campaign_form_start',
  form_location: 'global_footer'
});
```

### Event 2: Submit Attempt
Fires immediately when the user clicks the submit arrow button (or presses Enter).

```javascript
window.dataLayer.push({
  event: 'campaign_form_submit_attempt',
  form_location: 'global_footer'
});
```

### Event 3: Validation Error / Invalid Email
Fires if the name is missing, the email address is invalid, or the server rejects the submission.

```javascript
window.dataLayer.push({
  event: 'campaign_invalid_email',
  form_location: 'global_footer'
});
```

### Event 4: Newsletter Signup Success
Fires upon successful subscription response from the Shopify Admin API.

```javascript
window.dataLayer.push({
  event: 'newsletter_signup',
  form_location: 'global_footer'
});
```

---

## 4. Meta Pixel (Facebook Pixel) Event

Simultaneously with `newsletter_signup`, the standard Meta Pixel **`Lead`** event is fired directly via `window.fbq`:

```javascript
fbq('track', 'Lead', {
  content_name: 'Global Newsletter Signup',
  content_category: 'Newsletter',
  form_location: 'global_footer'
});
```

---

## 5. Summary Table for Marketers & GTM Configuration

| Event Name | Platform | Trigger Point | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `campaign_form_start` | GTM DataLayer | Focus on name or email input | `{ event: 'campaign_form_start', form_location: 'global_footer' }` |
| `campaign_form_submit_attempt` | GTM DataLayer | Click submit button | `{ event: 'campaign_form_submit_attempt', form_location: 'global_footer' }` |
| `campaign_invalid_email` | GTM DataLayer | Validation failure | `{ event: 'campaign_invalid_email', form_location: 'global_footer' }` |
| `newsletter_signup` | GTM DataLayer | Successful subscription | `{ event: 'newsletter_signup', form_location: 'global_footer' }` |
| `Lead` | Meta Pixel | Successful subscription | `fbq('track', 'Lead', { content_name: 'Global Newsletter Signup', content_category: 'Newsletter', form_location: 'global_footer' })` |

---

## 6. How to Test in Browser DevTools

1. Open the storefront in Chrome (`http://localhost:3000` or production).
2. Open **Chrome DevTools** (`F12`) and navigate to the **Console** tab.
3. Run the following command at any time to inspect captured footer newsletter events:
   ```javascript
   window.dataLayer.filter(e => e.form_location === 'global_footer');
   ```

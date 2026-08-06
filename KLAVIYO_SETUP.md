# Klaviyo Headless Newsletter Integration (Hydrogen ➡️ Shopify ➡️ Klaviyo)

This document outlines how the custom newsletter/giveaway signup flow works, starting from the custom Hydrogen storefront, passing through Shopify, and triggering an automated email in Klaviyo.

## 🌊 The End-to-End Flow

1. **Frontend (Hydrogen):** A user submits their email via the custom newsletter form component (`SignupSection.tsx`).
2. **Backend (Hydrogen):** The server-side action (`newsletter.server.ts`) securely authenticates with Shopify's Admin API and runs the `customerEmailMarketingConsentUpdate` mutation. It sets `marketingOptInLevel: SINGLE_OPT_IN` and appends a unique tracking tag (e.g., `campaign_signup:newsletter-signup`).
3. **Data Sync (Shopify ➡️ Klaviyo):** Because Klaviyo is integrated with Shopify, Shopify automatically and instantly syncs the updated customer profile, their marketing consent, and their new tags into the Klaviyo database.
4. **Trigger (Klaviyo):** A dynamic Klaviyo **Segment** automatically detects the new tag and pulls the user in.
5. **Action (Klaviyo):** A Klaviyo **Flow** detects that the user entered the segment and immediately fires the automated welcome email.

---

## ⚙️ Klaviyo Setup Guide

Whenever you launch a new campaign or need to wire up a new tag from Hydrogen, follow these exact steps in Klaviyo to ensure 100% deliverability.

### 🚨 Crucial Pre-requisite 1: Disable Double Opt-in
By default, Klaviyo lists are set to "Double Opt-in". If left on, users who submit the custom Hydrogen form will be intercepted by a generic "Confirm your subscription" email from Klaviyo. 
*Why this breaks the flow:* If a user enters the Segment *before* they are confirmed, Klaviyo skips sending the Welcome Email. When they finally click "Confirm", they are *already* in the segment, so the flow does not re-trigger. 

To fix this and ensure the custom flow triggers immediately:
1. In Klaviyo, go to **Integrations > Shopify** to see which list Shopify is syncing to (e.g., `Email List`).
2. Go to **Audience > Lists & segments** and click on that exact List.
3. Click **Settings > Consent**.
4. Change the setting from Double opt-in to **Single opt-in**.
5. **IMPORTANT:** Scroll to the bottom and click **Save**.

**⚠️ KLAVIYO ACCOUNT OVERRIDE WARNING:**
If you set the list to Single Opt-in but you are *still* receiving a "Confirm Your Subscription" email (often from a different default sender name), you have hit a Klaviyo Account Restriction. Klaviyo forcefully overrides Single Opt-in for some new accounts or specific regions to protect sender reputation. If this happens, your architecture is fine, but you must contact Klaviyo Support to have them manually remove the Double Opt-in restriction from your account.

### 🚨 Crucial Pre-requisite 2: Turn off Smart Sending
When building flows (especially Welcome emails), you must turn off "Smart Sending". If it is on, Klaviyo will refuse to send the email to anyone who has received another email from you in the last 16 hours. This often blocks testing.
1. Inside your Flow, click the **Email block**.
2. Look at the left sidebar under **Settings**.
3. Toggle **Smart Sending** to **OFF**. 

### Step 1: Create the Segment
Because we trigger emails based on Shopify Tags (rather than native Klaviyo forms), you must first create a Segment to catch the tags.
1. In Klaviyo, go to **Audience > Lists & segments**.
2. Click **Create** (dropdown) > **Segment**.
3. **Name:** e.g., `Campaign: Newsletter Giveaway`
4. **Definition:** 
   - Select **Properties about someone**
   - Dimension: **Shopify Tags**
   - Condition: **contains the text**
   - Value: `campaign_signup:newsletter-signup` *(or whatever tag your Hydrogen app is sending)*
   - Type: **List**
5. Click **Create segment**.

### Step 2: Create the Flow
The Flow is the actual automation pipeline that sends the email.
1. Go to **Flows** in the left sidebar.
2. Click **Create flow** (top right) > **Build your own** (top right).
3. **Name:** e.g., `Giveaway Welcome Email`. (Leave Tags blank).
4. Click **Create flow**.

### Step 3: Set the Trigger
1. In the left panel, click the **All triggers** tab.
2. Click **Added to segment**.
3. Select the Segment you created in Step 1.
4. **Re-entry criteria:** Select **No re-entry** (this prevents a user from getting the welcome email twice if they somehow re-submit the form).
5. Click the black **Save** button.

### Step 4: Design the Email (INLINE CSS REQUIRED)
1. From the left sidebar, drag the **Email** block onto the `+` icon underneath your Trigger.
2. Turn off **Smart Sending** (see Pre-requisite 2).
3. Click the Email block on the canvas to open its settings. Fill out the Subject line and click Save.
4. Click **Edit** to design the email.
5. **CRITICAL HTML RULE:** If you are coding a custom HTML email, you **must use Inline CSS** and HTML tables. Do NOT use a `<style>` block in the `<head>`. Email clients (like Gmail, older Outlook, or Temp Mails) will aggressively strip out `<style>` tags, completely breaking your dark mode, colors, and image sizes. Put styles directly on the elements (e.g., `<td style="background-color: #111111;">`, `<img width="220" />`).

### Step 5: Turn it Live
1. On the main Flow Builder canvas, click the black **Review and turn on** button in the top right corner.
2. Ensure the status is set to **Live**.
3. Click **Save**. The flow is now active!

---

## 🛠️ Developer Notes / Troubleshooting

- **Admin API Mutation:** Shopify has deprecated updating marketing consent via the standard `customerUpdate` mutation. You **must** use the dedicated `customerEmailMarketingConsentUpdate` mutation when passing consent from Hydrogen.
- **Local Testing (403 Errors):** If you are testing the login/signup flow locally using `npx shopify hydrogen dev --customer-account-push`, Shopify will block the login redirect (403 Unauthorized) unless you whitelist your newly generated temporary tunnel URL.
- **Manual Testing in Klaviyo:** If you want to test the email design without going through the Shopify form, open the Email block in the Flow, click the **Preview** button (eyeball icon) at the top right, select **Send as an email**, and enter your personal email address. *Note: Avoid sending to Temp Mails using this method, as they often block Klaviyo test servers.*
- **Channel Consent Warning:** In Klaviyo, a synced profile might show a yellow warning saying *"Email: Never Subscribed"* under Channel Consent. This is normal for headless setups. As long as their Custom Properties show `Accepts Marketing: true` and they have the correct Shopify Tag, the Segment-triggered flow will still successfully send the email.

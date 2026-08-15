# Klaviyo Headless Newsletter & Campaign Integration (Hydrogen ➡️ Shopify ➡️ Klaviyo)

This document provides a comprehensive guide for deploying and maintaining the headless campaign newsletter integration for **Vice Golf**. It details the dual-tagging architecture, Sanity CMS configuration, Shopify Admin API workflow, and production Klaviyo setup with real-time email delivery.

---

## 🌊 Architecture Overview

When a user submits their email on any Campaign page (`/campaign/:slug`):

```
+-------------------+        +----------------------+        +-------------------+        +--------------------+
|  Hydrogen App     |        |    Shopify Admin     |        |  Shopify-Klaviyo  |        |    Klaviyo Flow    |
| (Campaign Route)  | -----> |   (Customer Record)  | -----> |    Data Sync      | -----> | (List + Tag Filter)|
+-------------------+        +----------------------+        +-------------------+        +--------------------+
  Attaches 2 Tags:             Sets consent to                 Syncs profile to          List Trigger catches
  1. campaign_signup           SUBSCRIBED and                  Email List in             tag: campaign_signup
  2. customTag / slug tag      stores both tags                real-time                 & sends Email instantly
```

1. **Frontend (Hydrogen):** User submits their email in `SignupSection.tsx`.
2. **Sanity CMS:** Fetches campaign details including optional `customTag` (`Klaviyo / Campaign Tag`).
3. **Backend (Hydrogen Server Action):** Calls `processNewsletterSignup()` in `newsletter.server.ts`:
   - Updates/Creates customer via Shopify Admin GraphQL API (`CUSTOMER_CONSENT_UPDATE_MUTATION` & `TAGS_ADD_MUTATION`).
   - Sets `marketingState: SUBSCRIBED` with `SINGLE_OPT_IN`.
   - **Dual-Tagging System:** Attaches TWO tags:
     - `campaign_signup` *(Universal Tag)*
     - `customTag` || `campaign_signup:${campaignSlug}` *(Campaign-Specific Tag)*
4. **Data Sync (Shopify ➡️ Klaviyo):** Shopify syncs subscriber records and tags to Klaviyo's primary list (`Email List`) in real-time.
5. **Klaviyo Flow (Real-Time List Trigger):** Flow triggers instantly on `Added to Email List` filtered by `Shopify Tags contains campaign_signup`.
6. **Klaviyo Universal Segment:** Parallel segment `Campaign: Newsletter Giveaway` catches all signups for audience grouping & future campaign blasts.

---

## ⚙️ Production Deployment Checklist

### Step 1: Sanity CMS Setup
1. In Sanity Studio (`/structure/campaignPage`), each campaign page has:
   - **Slug:** e.g., `newsletter-campaign`
   - **Klaviyo / Campaign Tag (`customTag`):** (Optional). You can specify a custom tag (e.g. `summer-offer`). If left blank, Hydrogen defaults to `campaign_signup:<slug>`.
2. Publish the Campaign document in Sanity.

---

### Step 2: Klaviyo Integration & Single Opt-in Settings

#### A. Single Opt-in Requirement
By default, Klaviyo lists are set to "Double Opt-in". **Double Opt-in must be set to Single Opt-in** so welcome emails fire immediately without asking users to click a confirmation link:

1. In Klaviyo Admin, go to **Integrations ➔ Shopify**.
2. Note the list selected under **Sync settings** (e.g., `Email List`).
3. Go to **Audience ➔ Lists & segments**, click on that list (`Email List`).
4. Click **Settings ➔ Consent**.
5. Switch from Double opt-in to **Single opt-in**.
6. Click **Save**.

---

### Step 3: Create the Universal Segment in Klaviyo (Audience Grouping)

To group subscribers across ALL current and future campaigns for analytics and campaign blasts:

1. Go to **Audience ➔ Lists & segments**.
2. Click **Create / Import ➔ Create Segment**.
3. **Name:** `Campaign: Newsletter Giveaway`
4. **Definition:**
   - **Type:** `Properties about someone`
   - **Dimension:** `Shopify Tags`
   - **Condition:** `contains`
   - **Value:** `campaign_signup`
   - **Type:** `List`
5. Click **Create segment**.

---

### Step 4: Configure the Real-Time Klaviyo Flow

To ensure **instant real-time email delivery** (bypassing background segment recalculation delays):

1. Go to **Flows** in the left sidebar ➔ Click **Create flow ➔ Build your own**.
2. **Name:** `Giveaway Welcome Email`.
3. **Trigger Setup:**
   - Select **Added to list** ➔ choose **Email List**.
   - **Re-entry criteria:** Select **No re-entry**.
4. **Add Profile Filter (Tag Check):**
   - Click **Profile filters** ➔ **Add profile filter**.
   - **Condition:** `Properties about someone` ➔ **Shopify Tags** `contains` `campaign_signup` (Type: `List`).
   - Click **Save**.
5. **Add Email Action:**
   - Drag the **Email** block under the trigger.
   - **Email Name:** `Giveaway Entry Confirmation`.
   - **Subject Line:** `You are entered into the Vice Golf giveaway!`.
   - **Smart Sending:** Turn **OFF** (`Skip recently emailed profiles` unchecked).
   - Paste/edit the custom HTML dark mode email template.
6. **Set Status to LIVE:**
   - Click **Review and turn on** in the top right corner.
   - Set status to **Live** and click **Turn on flow**.

---

### Step 5: Historical Data Re-import (Optional / One-Time Sync)

If existing test users signed up before the flow was live:
1. Go to **Integrations ➔ Shopify**.
2. Scroll to the bottom under **Historical data**.
3. Click **Re-import**.

---

## 🎨 HTML Email Design Guidelines

When creating custom HTML email templates for Klaviyo (such as the Vice Golf dark mode template):

1. **Inline CSS Only:** Use inline styles directly on elements (e.g., `<td style="background-color: #121212; color: #ffffff;">`). Do **NOT** rely solely on `<style>` tags in `<head>`, as Gmail and Outlook strip external head styles.
2. **Table Layouts:** Use HTML `<table>`, `<tr>`, `<td>` for structure.
3. **Footer Requirements:** Include required compliance tags:
   - Unsubscribe link: `{% unsubscribe %}` or `{% unsubscribe_link %}`
   - Official copyright text: `© 2025 Vice Sporting Goods, Inc. All Rights Reserved.`
4. **Image Hosting:** Use absolute HTTPS image URLs hosted on Shopify CDN or Sanity CDN.

---

## 🛠️ Code Reference & Files

| Component | Path | Responsibility |
|---|---|---|
| **Sanity Schema** | `sanityvice/schemaTypes/documents/campaignPage.ts` | Defines `slug` and `customTag` schema fields |
| **GROQ Query** | `bot-ecom-hydrogen/app/lib/sanity/campaign.ts` | Fetches `customTag` from Sanity |
| **Server Action** | `bot-ecom-hydrogen/app/lib/shopify/newsletter.server.ts` | Executes Shopify Admin mutations & dual-tagging |
| **Campaign Route** | `bot-ecom-hydrogen/app/routes/($locale).campaign.$slug.tsx` | Receives form submit & handles loader/action logic |

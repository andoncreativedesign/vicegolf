# Klaviyo Headless Newsletter & Campaign Integration (Hydrogen ➡️ Shopify ➡️ Klaviyo)

This document provides a comprehensive guide for deploying and maintaining the headless campaign newsletter integration for **Vice Golf**. It details the dual-tagging architecture, Sanity CMS configuration, Shopify Admin API workflow, and production Klaviyo setup.

---

## 🌊 Architecture Overview

When a user submits their email on any Campaign page (`/campaign/:slug`):

```
+-------------------+        +----------------------+        +-------------------+        +-------------------+
|  Hydrogen App     |        |    Shopify Admin     |        |  Shopify-Klaviyo  |        |   Klaviyo Flow    |
| (Campaign Route)  | -----> |   (Customer Record)  | -----> |    Data Sync      | -----> | (Segment Trigger) |
+-------------------+        +----------------------+        +-------------------+        +-------------------+
  Attaches 2 Tags:             Sets consent to                 Syncs profile &           Catches tag:
  1. campaign_signup           SUBSCRIBED and                  tags to Klaviyo           campaign_signup
  2. customTag / slug tag      stores both tags                database                  & sends Email
```

1. **Frontend (Hydrogen):** User submits their email in `SignupSection.tsx`.
2. **Sanity CMS:** Fetches campaign details including optional `customTag` (`Klaviyo / Campaign Tag`).
3. **Backend (Hydrogen Server Action):** Calls `processNewsletterSignup()` in `newsletter.server.ts`:
   - Updates/Creates customer via Shopify Admin GraphQL API (`CUSTOMER_CONSENT_UPDATE_MUTATION` & `TAGS_ADD_MUTATION`).
   - Sets `marketingState: SUBSCRIBED` with `SINGLE_OPT_IN`.
   - **Dual-Tagging System:** Attaches TWO tags:
     - `campaign_signup` *(Universal Tag)*
     - `customTag` || `campaign_signup:${campaignSlug}` *(Campaign-Specific Tag)*
4. **Data Sync (Shopify ➡️ Klaviyo):** Shopify syncs customer records and tags to Klaviyo.
5. **Klaviyo Segment:** Segment catches profiles with `Shopify Tags contains campaign_signup`.
6. **Klaviyo Flow:** Automated welcome email fires to the recipient's inbox.

---

## ⚙️ Production Deployment Checklist

### Step 1: Sanity CMS Setup
1. In Sanity Studio (`/structure/campaignPage`), each campaign page has:
   - **Slug:** e.g., `newsletter-campaign`
   - **Klaviyo / Campaign Tag (`customTag`):** (Optional). You can specify a custom tag (e.g. `summer-offer`). If left blank, Hydrogen defaults to `campaign_signup:<slug>`.
2. Publish the Campaign document in Sanity.

---

### Step 2: Klaviyo Integration & List Settings

#### A. Single Opt-in Requirement
By default, Klaviyo lists are set to "Double Opt-in". **Double Opt-in must be disabled** so welcome emails fire immediately without asking users to click a confirmation link:

1. In Klaviyo Admin, go to **Integrations ➔ Shopify**.
2. Note the list selected under **Sync settings** (e.g., `Email List`).
3. Go to **Audience ➔ Lists & segments**, click on that list (`Email List`).
4. Click **Settings ➔ Consent**.
5. Switch from Double opt-in to **Single opt-in**.
6. Scroll down and click **Save**.

*Note: If Klaviyo enforces Double Opt-in on a new account, contact Klaviyo Support to lift the Double Opt-in restriction for single-opt-in compliance.*

---

### Step 3: Create the Universal Segment in Klaviyo

To eliminate the need to update Klaviyo every time a marketer creates or renames a campaign in Sanity, use a **Universal Segment Rule**:

1. In Klaviyo, go to **Audience ➔ Lists & segments**.
2. Click **Create / Import ➔ Create Segment**.
3. **Name:** `Campaign: Newsletter Giveaway`
4. **Definition:**
   - **Type:** `Properties about someone`
   - **Dimension:** `Shopify Tags`
   - **Condition:** `contains the text`
   - **Value:** `campaign_signup`
5. Click **Create segment** (and then click **Update segment**).

> 💡 **Why this works:** Every campaign signup automatically receives `campaign_signup`. This single segment catches signups from **ALL current and future campaigns** with zero manual Klaviyo maintenance!

---

### Step 4: Configure the Klaviyo Flow

1. Go to **Flows** in the left sidebar.
2. Click **Create flow ➔ Build your own**.
3. **Name:** `Giveaway Welcome Email`.
4. **Trigger Setup:**
   - Select **Added to segment**.
   - Choose your segment: `Campaign: Newsletter Giveaway`.
   - **Re-entry criteria:** Select **No re-entry** (prevents duplicate emails if users re-submit).
   - Click **Save**.
5. **Add Email Action:**
   - Drag the **Email** block under the trigger.
   - Click the Email block ➔ Turn **Smart Sending** to **OFF** (so test/welcome emails aren't delayed or blocked).
   - Add your Subject Line (e.g. *"You are entered into the Vice Golf giveaway!"*).
   - Design your email content.
6. **Set Status to LIVE:**
   - Click **Update status** in the top right corner.
   - Set status to **Live** and click **Save**.

---

### Step 5: Initial Historical Data Re-import (One-Time Setup)

When first setting up or after updating segment rules for existing test users:
1. Go to **Integrations ➔ Shopify**.
2. Scroll to the bottom under **Historical data**.
3. Click **Re-import**.
4. This immediately syncs all existing Shopify customer tags to Klaviyo.

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

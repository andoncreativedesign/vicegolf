# Client Features Estimation & Technical Specification (Final - Without Sanity)
**Storefront: Vice Golf (vicegolf.ae)**
*Architecture: Hydrogen Storefront (Remix / Oxygen) ➡️ Shopify Admin API ➡️ GTM & Meta Analytics*

This document provides the updated client-facing estimation with **Sanity CMS removed** from the global newsletter feature (since it is a permanent sitewide element, hardcoded for maximum performance and zero CMS latency).

---

## Tab 1: Global Newsletter & Auto Account Creation (Hydrogen, Shopify, GTM)
**Summary:** Sitewide footer newsletter capture with Full Name and Email fields. Includes asynchronous submission via Remix API route, automated customer account creation with marketing consent (`SUBSCRIBED`) in Shopify Admin API, automated customer tagging, and custom GTM DataLayer & Meta Pixel conversion tracking. *(Sanity CMS and Klaviyo setup excluded).*

### Google Sheets Copy-Paste Table (Tab 1):
```tsv
Module / Platform	Task Title	Task Description & Technical Scope	Estimated Hours
Hydrogen Frontend	Footer UI Component Refactor	Uncomment existing footer newsletter layout in Footer.tsx. Build responsive dual-pill design (Full Name + Email inputs + submit button). Fully mobile and desktop optimized across break-points.	2.00
Hydrogen Frontend	Interactive States & UX Feedback	Implement user feedback states: idle, submitting (inline spinner), success state ("Thank you for subscribing!"), and client-side error handling for invalid emails and blank fields.	1.50
Hydrogen Server API	Dedicated Newsletter Endpoint	Build /api/newsletter Remix action route to accept POST payload, validate inputs, rate-limit, and interface with backend services without full page reload.	1.50
Shopify Admin API	Customer Existence & Account Lookup	Query Shopify Admin GraphQL API by email. Detect whether the customer record already exists or needs to be newly provisioned with proper token/permission handling.	1.00
Shopify Admin API	Auto-Account Creation & Name Splitting	Parse full name into firstName and lastName. Automatically create customer account via customerCreate mutation if no account exists in Shopify.	1.50
Shopify Admin API	Marketing Consent & Single Opt-In	Execute customerEmailMarketingConsentUpdate mutation setting marketingState to SUBSCRIBED with SINGLE_OPT_IN level for immediate subscriber eligibility.	1.00
Shopify Admin API	Dual-Tagging & Customer Segmentation	Attach universal tag (newsletter_signup) and specific tag (global_newsletter) via tagsAdd mutation without overwriting existing customer tags.	1.00
GTM & Meta Analytics	GTM DataLayer Implementation	Implement globalNewsletterTrack module pushing events: form_start, submit_attempt, invalid_email, and { event: 'newsletter_signup', form_location: 'global_footer' }.	1.50
GTM & Meta Analytics	Meta Pixel Lead Event Tracking	Fire direct Meta Pixel event fbq('track', 'Lead', { content_name: 'Global Newsletter Signup', form_location: 'global_footer' }) on successful signup.	0.50
QA & Verification	Cross-Device & Browser UI Testing	Cross-browser testing across mobile Safari (iOS), Chrome (Android), tablet, and desktop (Chrome, Safari, Firefox). Verify accessibility and keyboard behavior.	1.50
QA & Verification	End-to-End System Integration Testing	Live submission verification: check Shopify Admin customer creation, check name & consent status, verify tag assignments, and test GTM Debug Preview.	2.00
Total Estimated Time		Tab 1 Total Hours	15.00
```

---

## Tab 2: Country Traffic Security (Block Chinese Traffic)
**Summary:** Edge-level security check in Oxygen worker server entry (`server.ts`). Intercepts incoming requests before Hydrogen storefront rendering using Oxygen's native `oxygen-buyer-country` header, rejecting traffic from specified blocked regions (`CN`) with a lightweight `403 Forbidden` response without consuming server rendering resources.

### Google Sheets Copy-Paste Table (Tab 2):
```tsv
Module / Platform	Task Title	Task Description & Technical Scope	Estimated Hours
Oxygen Server Entry	Edge Country Filter in server.ts	Inspect request header 'oxygen-buyer-country'. If 'CN', return immediate 403 Forbidden response with Cache-Control: no-store before executing Remix/Hydrogen SSR.	0.75
Security Verification	Geo-IP & Mock Header Verification	Validate via mock curl requests and verify that legitimate GCC traffic (AE, SA, OM, QA) and static assets are unaffected.	0.75
Total Estimated Time		Tab 2 Total Hours	1.50
```

---

## Tab 3: Regional URL Routing (Root Path for UAE Default)
**Summary:** Seamless multi-country routing structure where regional markets use localized prefixes (`/en-sa`, `/en-qa`, `/en-om`), while the primary flagship market (United Arab Emirates) serves directly from root domain paths (`https://vicegolf.ae/`, `https://vicegolf.ae/products/...`) instead of `/en-ae/`, avoiding redundant redirects and improving primary store SEO.

### Google Sheets Copy-Paste Table (Tab 3):
```tsv
Module / Platform	Task Title	Task Description & Technical Scope	Estimated Hours
i18n & Context	Normalize UAE pathPrefix to Root	Update i18n.ts to set UAE pathPrefix to '' (root domain) while keeping /en-sa, /en-qa, /en-om for GCC markets.	1.00
Country Switcher & Redirects	Selector Links & 301 Canonical Redirect	Update header country selector links for UAE to point to root, and add 301 redirect for any incoming legacy /en-ae/* traffic to /*.	1.00
Multi-Country QA	Navigation & Cart Verification	Verify switching between UAE (root) and other regions (SA/OM/QA) preserves cart items and loads proper currency.	1.00
Total Estimated Time		Tab 3 Total Hours	3.00
```

---

## 📈 Combined Summary of All 3 Features (Summary Tab)

```tsv
Tab / Feature	Feature Summary	Estimated Hours
Tab 1	Global Newsletter & Auto-Account (Hydrogen UI/API, Shopify Mutations, GTM)	15.00
Tab 2	Country Traffic Security (Block Chinese Traffic via Oxygen Header)	1.50
Tab 3	Regional URL Routing (UAE Root Domain without /en-ae prefix)	3.00
Grand Total	Full Implementation of All 3 Features	19.50
```

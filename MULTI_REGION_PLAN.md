# Multi-Region Expansion Roadmap (v2-multi-region)
**GCC Expansion: United Arab Emirates (AED), Saudi Arabia (SAR), and Oman (OMR)**

This document details the step-by-step implementation plan for expanding the Vice Golf Hydrogen + Shopify storefront to support Saudi Arabia and Oman alongside the UAE.

---

## 🌿 Git Branching Strategy

- **Main Integration Branch**: `release/v2-multi-region`
- **Workflow**:
  1. Each feature is developed in its own dedicated feature branch cut from `release/v2-multi-region`.
  2. Each branch represents a **fully testable, self-contained vertical slice**.
  3. Once verified end-to-end, create a PR and merge back into `release/v2-multi-region`.
  4. After all feature branches are completed and verified, `release/v2-multi-region` will be merged into `dev`.

---

## 🗺️ Feature Implementation Order

```
[Branch 1] feature/country-switcher-and-routing
     │
     ▼
[Branch 2] feature/dynamic-currency-pricing
     │
     ▼
[Branch 3] feature/multi-currency-cart-and-checkout
     │
     ▼
[Branch 4] feature/address-and-phone-validation
     │
     ▼
[Branch 5] feature/shipping-policies-and-sla
     │
     ▼
[Branch 6] feature/e2e-testing-and-live-orders
```

---

## 📦 Detailed Feature Branches & Scopes

### Feature 1: Country Switcher & Regional Routing
* **Branch Name**: `feature/country-switcher-and-routing`
* **Objective**: Enable switching between UAE, KSA, and Oman directly from the header, persisting user preference and updating localized URL routes.
* **Scope**:
  - **i18n & Context Setup**:
    - Update `app/lib/i18n.ts` to parse `/en-ae`, `/en-sa`, and `/en-om`, with `['EN', 'AE']` as the default fallback.
    - Update `app/lib/context.ts` to pass the active market country (`AE`, `SA`, `OM`) to `@shopify/hydrogen` context for Storefront API queries.
    - Persist selected country in session cookie for returning users.
  - **Header UI Switcher**:
    - In `app/components/Header.tsx`, unhide, refine, and enable `CountryCurrencySelector` for desktop and mobile drawer.
    - Add flags and currency labels:
      - UAE: AED
      - Saudi Arabia: SAR
      - Oman: OMR
    - Connect country click to localized route navigation (`/en-ae`, `/en-sa`, `/en-om`).
    - Implement outside click and Escape key dismissal.
* **Verification Criteria**:
  1. User can click country dropdown on desktop or mobile.
  2. Selecting Saudi Arabia changes URL route to `/en-sa`, updates header flag/label to SAR.
  3. Page reload preserves selected region via cookie.

---

### Feature 2: Dynamic Currency & Localized Product Pricing
* **Branch Name**: `feature/dynamic-currency-pricing`
* **Objective**: Remove hardcoded AED currency displays across the catalog and dynamically format prices per market standards (including 3 decimals for OMR).
* **Scope**:
  - **Core Price Component**:
    - Refactor `app/components/ProductPrice.tsx` to replace static `AedIcon` with dynamic currency formatting.
    - Implement decimal formatting helper:
      - 2 decimals for AED & SAR (e.g., `AED 150.00`, `SAR 150.00`)
      - 3 decimals for OMR (e.g., `OMR 16.500`)
  - **Catalog UI Updates**:
    - Update `ProductCard.tsx`, `VariantProductCard.tsx`, and `ProductItem.tsx`.
    - Update search results and predictive search dropdown (`SearchResults.tsx`).
    - Update collection filter price facets (`SortFilter.tsx`).
  - **PDP & Volume Tiers**:
    - Update Golf Ball PDP, Club sets, and apparel PDPs.
    - Refactor `ProductOptionDozen.tsx` volume bundle tier pricing (1, 2, 3, 5 dozens) to recalculate and display in active currency.
* **Verification Criteria**:
  1. Browsing `/en-ae` displays AED with 2 decimals.
  2. Switching to `/en-sa` converts all visible catalog prices to SAR.
  3. Switching to `/en-om` converts all visible prices to OMR with 3 decimals.
  4. Dozen bundle tables recalculate correctly for each market.

---

### Feature 3: Multi-Currency Cart, Checkout & Membership Tier Discounts
* **Branch Name**: `feature/multi-currency-cart-and-checkout`
* **Objective**: Maintain cart integrity across country switches, show dynamic currency in cart drawer, recalculate tier discounts, and route to localized Shopify checkout.
* **Scope**:
  - **Cart UI & Calculations**:
    - Refactor `CartSummary.tsx` and `CartLineItem.tsx` to remove hardcoded AED icons and use dynamic `<Money />` components.
    - Ensure optimistic cart updates recalculate line totals when region is changed.
  - **Membership Tier Discounts**:
    - Update `app/hooks/useMembership.ts` and `app/root.tsx` loader discount logic to calculate tag-based tier savings (`vice_staff`, `vice_legend`, etc.) in the active market currency.
  - **Checkout Flow**:
    - Validate checkout URL creation sends user to Shopify checkout in the selected currency (SAR/OMR).
* **Verification Criteria**:
  1. Adding products to cart on `/en-ae` and switching to `/en-sa` keeps line items intact and converts subtotal to SAR.
  2. Member discount badges show savings in local currency.
  3. Clicking Checkout redirects to Shopify Checkout with SAR or OMR selected.

---

### Feature 4: Address Book & Regional Phone Validation
* **Branch Name**: `feature/address-and-phone-validation`
* **Objective**: Allow customers to save and edit addresses in UAE, Saudi Arabia, and Oman with proper phone number masks.
* **Scope**:
  - **Country Dropdown**:
    - In `app/components/basic/CountrySelector.tsx`, remove `.filter(country === 'AE')` to unlock UAE, Saudi Arabia, and Oman.
  - **Phone Input Field**:
    - Update `app/components/basic/PhoneInputField.tsx` to support:
      - UAE: `+971` (9 digits)
      - KSA: `+966` (9 digits)
      - Oman: `+968` (8 digits)
    - Auto-switch flag and country code based on user input.
  - **Address Mutations**:
    - Verify address save and update mutations in `account.addresses.add.tsx` and `account.addresses.update.tsx` for KSA provinces and Oman governorates.
* **Verification Criteria**:
  1. Address form allows selecting UAE, KSA, and Oman.
  2. Phone field formats correctly for `+966` and `+968`.
  3. Address creation and update mutations succeed without validation errors.

---

### Feature 5: Shipping Policies, SLAs & Regional Content
* **Branch Name**: `feature/shipping-policies-and-sla`
* **Objective**: Display accurate transit times and customs/tax information tailored to Dubai fulfillment.
* **Scope**:
  - **Shipping SLA Badges**:
    - Update `app/components/ShippingInfo.tsx` transit times:
      - UAE: 1–2 business days
      - Oman: 1–3 business days
      - KSA: 2–4 business days
  - **Policy & Duties**:
    - Update `duties-taxes.tsx` and customs guide with DDP terms, 15% KSA VAT, and 5% Oman VAT explanations.
  - **SEO / Metadata**:
    - Output localized URLs (`/en-ae`, `/en-sa`, `/en-om`) in sitemap and canonical tags.
* **Verification Criteria**:
  1. PDP shipping accordion shows correct delivery days per market.
  2. Policy pages display DDP and local VAT details accurately.

---

### Feature 6: End-to-End Integration, Regression & Live Test Orders
* **Branch Name**: `feature/e2e-testing-and-live-orders`
* **Objective**: Comprehensive cross-device QA and live test transactions.
* **Scope**:
  - Regression testing across all pages and viewports (mobile and desktop).
  - Live test orders in SAR and OMR to verify payment gateway, tax calculation, and order sync in Shopify Admin.
  - Final cleanup and PR into `release/v2-multi-region`, followed by integration into `dev`.
* **Verification Criteria**:
  1. Zero console errors on route or currency transitions.
  2. Successful test order creation in Shopify Admin for SAR and OMR.

import axios from "axios";

export const SANITY_CONFIG = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
};

console.log("\n\nSANITY_CONFIG ", SANITY_CONFIG, "\n")

export const axiosSanity = axios.create({
  baseURL: `https://${SANITY_CONFIG?.projectId}.api.sanity.io/${SANITY_CONFIG?.apiVersion}/data/query/${SANITY_CONFIG?.dataset}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SANITY_CONFIG?.token}`,
  },
});

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL

/**
 * Use API 2025-10+ for Admin requests. Required for automatic discounts with
 * customer-segment eligibility (e.g. "Plus Member Discount") - they are
 * filtered out in older API versions. See:
 * https://shopify.dev/changelog/discount-eligibility-management
 */
const ADMIN_API_URL_2025_10 = ADMIN_API_URL?.replace(
  /\/admin\/api\/\d{4}-\d{2}(\/|$)/,
  '/admin/api/2025-10$1'
) || ADMIN_API_URL;

export const axiosShopifyAdmin = axios.create({
  baseURL: (ADMIN_API_URL_2025_10 || ADMIN_API_URL) + '/graphql.json',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
  }
});

export const axiosShopifyAdminCustomerApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
  },
});
import axios from "axios";

export const SANITY_CONFIG = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
};

// console.log("\n\nSANITY_CONFIG ", SANITY_CONFIG, "\n")

export const axiosSanity = axios.create({
  baseURL: `https://${SANITY_CONFIG?.projectId}.api.sanity.io/${SANITY_CONFIG?.apiVersion}/data/query/${SANITY_CONFIG?.dataset}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SANITY_CONFIG?.token}`,
  },
});

/**
 * Creates a Sanity axios instance using dynamic environment variables.
 * Prioritizes `env` from loader context but falls back to static `import.meta.env`.
 */
export function createAxiosSanity(env?: any) {
  const projectId = env?.VITE_SANITY_PROJECT_ID || SANITY_CONFIG.projectId;
  const dataset = env?.VITE_SANITY_DATASET || SANITY_CONFIG.dataset;
  const apiVersion = env?.VITE_SANITY_API_VERSION || SANITY_CONFIG.apiVersion;
  const token = env?.VITE_SANITY_API_TOKEN || SANITY_CONFIG.token;

  return axios.create({
    baseURL: `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    timeout: 20000,
  });
}

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL

/**
 * Use API 2024-10+ for Admin requests.
 */
// const ADMIN_API_URL_2025_10 = ADMIN_API_URL?.replace(
//   /\/admin\/api\/\d{4}-\d{2}(\/|$)/,
//   '/admin/api/2025-10$1'
// ) || ADMIN_API_URL;

export const axiosShopifyAdmin = axios.create({
  baseURL: ADMIN_API_URL + '/graphql.json',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
  }
});

/**
 * Creates a Shopify Admin API axios instance using dynamic environment variables.
 */
export function createAxiosShopifyAdmin(env: any) {
  const accessToken = env?.VITE_ADMIN_ACCESS_TOKEN || ADMIN_ACCESS_TOKEN;
  const apiUrl = env?.VITE_ADMIN_API_URL || ADMIN_API_URL;

  return axios.create({
    baseURL: apiUrl + '/graphql.json',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    timeout: 20000,
  });
}

export const axiosShopifyAdminCustomerApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
  },
});

/**
 * Creates a Shopify Admin Customer API axios instance using dynamic environment variables.
 */
export function createAxiosShopifyAdminCustomerApi(env: any) {
  const accessToken = env?.VITE_ADMIN_ACCESS_TOKEN || ADMIN_ACCESS_TOKEN;
  const apiUrl = env?.VITE_ADMIN_API_URL || ADMIN_API_URL;

  return axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    timeout: 20000,
  });
}
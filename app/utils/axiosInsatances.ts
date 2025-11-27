import axios from "axios";

export const SANITY_CONFIG = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
};

export const axiosSanity = axios.create({
  baseURL: `https://${SANITY_CONFIG?.projectId}.api.sanity.io/${SANITY_CONFIG?.apiVersion}/data/query/${SANITY_CONFIG?.dataset}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SANITY_CONFIG?.token}`,
  },
});


const ADMIN_ACCESS_TOKEN = 'REMOVED_TOKEN'
const ADMIN_API_URL = `https://tzasu4-jj.myshopify.com/admin/api/2025-01/graphql.json`

export const axiosShopifyAdmin = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
  }
});
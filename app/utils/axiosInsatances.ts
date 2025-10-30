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
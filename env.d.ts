/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SANITY_PROJECT_ID: string;
            SANITY_DATASET: string;
            SANITY_API_VERSION: string;
            SANITY_API_TOKEN: string;
        }
    }
}

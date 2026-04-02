// This file extends the Hydrogen types for this project
// The types are automatically available via @shopify/hydrogen/react-router-types

// Extend the session data for your app
declare module 'react-router' {
    interface SessionData {
        customerAccessToken?: string;
        cartId?: string;
    }
}

// Extend the environment variables for your app
declare global {
    interface Env {
        // Your custom environment variables
        SOME_API_KEY?: string;
        ADMIN_API_URL?: string;
        ADMIN_ACCESS_TOKEN?: string;
        PUBLIC_STORE_DOMAIN: string;
        PUBLIC_STOREFRONT_ID: string;
        PUBLIC_CHECKOUT_DOMAIN: string;
        PUBLIC_STOREFRONT_API_TOKEN: string;
        SESSION_SECRET: string;
    }
}

// Add additional context properties if needed
declare global {
    interface Window {
        dataLayer: any[];
    }
    interface HydrogenAdditionalContext {
        // Add any custom context properties your app needs
        // For example:
        // cms?: CMSClient;
    }
}

// Required to make this file a module and enable the augmentation
export { };
import { createAxiosShopifyAdmin } from '~/utils/axiosInsatances';

const GET_CUSTOMER_QUERY = `
  query getCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
          tags
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
          }
        }
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_CONSENT_UPDATE_MUTATION = `
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const TAGS_ADD_MUTATION = `
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function processNewsletterSignup(email: string, campaignSlug: string, env: any) {
  const adminApi = createAxiosShopifyAdmin(env);
  const tag = `campaign_signup:${campaignSlug}`;

  try {
    // 1. Check if customer exists
    const searchRes = await adminApi.post('', {
      query: GET_CUSTOMER_QUERY,
      variables: { query: `email:${email}` }
    });

    const customerNode = searchRes.data?.data?.customers?.edges?.[0]?.node;

    if (customerNode) {
      // Customer exists, update them
      const customerId = customerNode.id;
      const existingTags = customerNode.tags || [];
      const hasTag = existingTags.includes(tag);
      const isSubscribed = customerNode.emailMarketingConsent?.marketingState === 'SUBSCRIBED';

      if (!isSubscribed) {
        // Update marketing consent
        const updateRes = await adminApi.post('', {
          query: CUSTOMER_CONSENT_UPDATE_MUTATION,
          variables: {
            input: {
              customerId: customerId,
              emailMarketingConsent: {
                marketingState: 'SUBSCRIBED',
                marketingOptInLevel: 'SINGLE_OPT_IN'
              }
            }
          }
        });
        const updateErrors = updateRes.data?.data?.customerEmailMarketingConsentUpdate?.userErrors;
        if (updateErrors && updateErrors.length > 0) {
          console.error("Shopify customer update errors:", updateErrors);
          throw new Error(updateErrors[0].message);
        }
      }

      if (!hasTag) {
        // Add tag
        const tagRes = await adminApi.post('', {
          query: TAGS_ADD_MUTATION,
          variables: {
            id: customerId,
            tags: [tag]
          }
        });
        const tagErrors = tagRes.data?.data?.tagsAdd?.userErrors;
        if (tagErrors && tagErrors.length > 0) {
          console.error("Shopify tags add errors:", tagErrors);
        }
      }

      return { success: true, action: 'updated', customerId };
    } else {
      // Customer does not exist, create them
      const createRes = await adminApi.post('', {
        query: CUSTOMER_CREATE_MUTATION,
        variables: {
          input: {
            email,
            tags: [tag],
            emailMarketingConsent: {
              marketingState: 'SUBSCRIBED',
              marketingOptInLevel: 'SINGLE_OPT_IN'
            }
          }
        }
      });

      const createErrors = createRes.data?.data?.customerCreate?.userErrors;
      if (createErrors && createErrors.length > 0) {
        console.error("Shopify customer create errors:", createErrors);
        throw new Error(createErrors[0].message);
      }

      const newCustomerId = createRes.data?.data?.customerCreate?.customer?.id;
      return { success: true, action: 'created', customerId: newCustomerId };
    }
  } catch (error) {
    console.error("Error processing newsletter signup:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getCustomerSubscriptionStatus(email: string, campaignSlug: string, env: any) {
  const adminApi = createAxiosShopifyAdmin(env);
  const tag = `campaign_signup:${campaignSlug}`;

  try {
    const searchRes = await adminApi.post('', {
      query: GET_CUSTOMER_QUERY,
      variables: { query: `email:${email}` }
    });

    const customerNode = searchRes.data?.data?.customers?.edges?.[0]?.node;

    if (customerNode) {
      const existingTags = customerNode.tags || [];
      const hasTag = existingTags.includes(tag);
      const isSubscribed = customerNode.emailMarketingConsent?.marketingState === 'SUBSCRIBED';

      return {
        exists: true,
        isSubscribed,
        hasTag,
        customerId: customerNode.id
      };
    }

    return { exists: false, isSubscribed: false, hasTag: false };
  } catch (error) {
    console.error("Error checking customer subscription status:", error);
    return { exists: false, isSubscribed: false, hasTag: false };
  }
}

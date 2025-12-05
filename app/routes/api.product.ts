import { ADMIN_PRODUCTS_BY_FAMILY, type UIColorVariant } from "~/lib/shopify/product-queries";
import { axiosShopifyAdmin } from "~/utils/axiosInsatances";

interface ProductVariant {
  node: {
    id: string;
    title: string;
    handle: string;
    variantImage?: {
      reference?: {
        image?: {
          url: string;
          altText: string | null;
        };
      };
    };
    featuredImage?: {
      url: string;
      altText: string | null;
    };
  };
}

export async function action({ request }: any) {
  try {
    const formData = await request.formData();
    const familyName = formData.get('familyName') as string | null;

    if (!familyName) {
      return {
        error: 'Family name is required',
        status: 400
      }
    }

    // Fetch color variants using the family name
    const response = await axiosShopifyAdmin.post<{
      data?: {
        products: {
          edges: ProductVariant[];
        };
      };
      errors?: Array<{ message: string }>;
    }>("", {
      query: ADMIN_PRODUCTS_BY_FAMILY,
      variables: {
        searchQuery: `metafields.custom.family:"${familyName}"`,
      },
    });

    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      return {
        error: 'Failed to fetch product variants', details: response.data.errors,
        status: 500
      }
    }

    if (!response.data?.data?.products?.edges) {
      return {
        error: 'No product variants found',
        status: 404
      }
    }

    const mapColorVariants = (edges: ProductVariant[]): UIColorVariant[] => {
      return edges.map(({ node }) => {
        const variantMetaImage = node.variantImage?.reference?.image;
        const finalImage = variantMetaImage
          ? {
            url: variantMetaImage.url,
            altText: variantMetaImage.altText,
          }
          : node.featuredImage
            ? {
              url: node.featuredImage.url,
              altText: node.featuredImage.altText,
            }
            : null;

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          featuredImage: finalImage,
        };
      });
    };

    const colorVariants = mapColorVariants(response.data.data.products.edges);
    return { success: true, colorVariants }

  } catch (error) {
    console.error('Action error:', error);
    return {
      error: 'An error occurred while processing your request',
      status: 500
    }
  }
}
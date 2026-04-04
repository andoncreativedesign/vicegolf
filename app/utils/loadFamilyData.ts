import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD } from '~/lib/shopify/product-queries';

export async function loadFamilyData(families: string[]) {
  if (!families || families.length === 0) return {};

  const familyQueries = families.map(fam => ({
    value: fam,
    query: `metafields.custom.family:"${fam}"`,
  }));

  const results = await Promise.all(familyQueries.map(async (fam) => {
    try {
      const response = await axiosShopifyAdmin.post("", {
        query: ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD,
        variables: {
          searchQuery: fam.query,
        },
      });

      if (response.data.errors) {
        return { fam: fam.value, products: [] };
      }

      const colorVariantsRes = response.data?.data?.products?.edges || [];

      // Transform the product data to match the expected format
      const products = colorVariantsRes.map(({ node }: any) => ({
        ...node,
        id: node.id,
        title: node.title,
        productType: node.productType,
        tags: node?.tags,
        vendor: node?.vendor,
        handle: node?.handle,
        featuredImage: node?.featuredImage ? {
          id: node.featuredImage.id,
          url: node.featuredImage.url,
          altText: node.featuredImage.altText,
          width: node.featuredImage.width,
          height: node.featuredImage.height
        } : null,
        variantImage: node?.variantImage?.reference?.image ? {
          id: node.variantImage.reference.id,
          url: node.variantImage.reference.image.url,
          altText: node.variantImage.reference.image.altText,
          width: node.variantImage.reference.image.width,
          height: node.variantImage.reference.image.height
        } : null,
        availableForSale: (node?.availableForSale || 0) > 0,
        family: node?.family ? {
          id: node.family.id,
          namespace: node.family.namespace,
          key: node.family.key,
          type: node.family.type,
          value: node.family.value
        } : null,
        badge_colors: node?.badge_colors?.value || null,
        collections: {
          nodes: node.collections?.edges?.map(({ node: col }: any) => ({ id: col.id })) || []
        }
      }));

      return { fam: fam.value, products };
    } catch (e) {
      console.error(`Error loading family ${fam.value}:`, e);
      return { fam: fam.value, products: [] };
    }
  }));

  const familyGroups: Record<string, any[]> = {};
  results.forEach(({ fam, products }) => {
    familyGroups[fam] = products;
  });

  return familyGroups;
}

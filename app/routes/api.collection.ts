import type { Route } from "../+types/root";
import { GET_COLLECTION_DETAILS_WITHOUT_PRODUCTS } from "~/lib/shopify/product-queries";

export async function action({ request, context }: Route.ActionArgs) {
  const { storefront } = context;
  const form = await request.formData();
  const handle = form.get("handle");

  const response = await storefront.query(
    GET_COLLECTION_DETAILS_WITHOUT_PRODUCTS,
    {
      variables: { handle }
    }
  );

  return { collection: response.collection };
}

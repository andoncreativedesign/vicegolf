// app/components/JuniorCapProduct.tsx
import type { Product } from '@shopify/hydrogen/storefront-api-types';
import type { ProductDetails } from '~/lib/sanity/products';

type JuniorCapProductProps = {
  product: Product;
  productDetails: ProductDetails | null;
  initialRecommended?: any; // optional, if you want to pass recommended products later
  showBestSellers?: boolean;
};

export function JuniorCapProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false,
}: JuniorCapProductProps) {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="text-center text-2xl font-light">
        this is the junior cap page
      </div>
      {/* You can expand this later with reviews, recommendations, etc. */}
    </section>
  );
}
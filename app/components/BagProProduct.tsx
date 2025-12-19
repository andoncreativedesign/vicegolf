import type { ProductDetails } from '~/lib/sanity/products';
import type { Product } from '@shopify/hydrogen';

type BagProProductProps = {
  product: Product;
  productDetails: ProductDetails | null;
  initialRecommended?: any; // Adjust type as needed
  showBestSellers?: boolean;
};

export function BagProProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false,
}: BagProProductProps) {
  // You can expand this later with real content, images, etc.
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-8">This is the Bag Pro page</h1>
      <p className="text-xl text-gray-600">
        Product: {product.title}
      </p>
      {/* Add more sections, galleries, specs, recommendations, etc. here */}
    </div>
  );
}
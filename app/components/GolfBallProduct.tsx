import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { ProductDetailContents } from '~/components/Product/ProductDetailContents';
import { Youtube } from '~/components/Youtube';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';

type GolfBallProductProps = {
  product: ProductFragment;
};

export function GolfBallProduct({ product }: GolfBallProductProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await getProductDetails(product.id);
      setProductDetails(productDetails);
    }

    fetchProductDetails();
  }, [])

  return (
    <>
      {/* Reusable What's New Section */}
      {productDetails && 
        <ProductDetailContents
          content={productDetails?.productContent1?.content || []}
          content2={productDetails?.productContent2?.sections?.[0]}
        />
      }
      {/* Youtube Video Section */}
      <Youtube />
    </>
  );
}

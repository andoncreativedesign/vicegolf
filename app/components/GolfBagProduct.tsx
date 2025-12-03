// app/components/GolfBagProduct.tsx

import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type GolfBagProductProps = {
  product: ProductFragment;
};

export function GolfBagProduct({ product }: GolfBagProductProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = await getProductDetails(product.id);
      setProductDetails(details);
    };
    fetchProductDetails();
  }, [product.id]);

  return (
    <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="max-w-8xl mx-auto">
        {/* Dynamic Content Sections – Alternating: Text first → Image first → Text first... */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isEvenIndex = index % 2 === 0; // 0, 2, 4 → Text Left
          const isFirst = index === 0;

          // For the very first section, force full-width treatment like Polo (optional)
          if (isFirst) {
            return (
              <div key={index} className="w-full py-8">
                <ProductDetailsContent1
                  content={item}
                  showImageLeft={false}        // Text Left → Image Right
                  isTextFull={false}
                  isImageFull={false}
                  isFirst={true}
                  isDescriptionFull={false}
                  imageSize="xlarge"
                />
              </div>
            );
          }

          return (
            <div key={index} className="py-12">
              <ProductDetailsContent1
                content={item}
                showImageLeft={!isEvenIndex}   // Even index (0,2,4) → Text Left → showImageLeft = false
                                               // Odd index (1,3,5) → Image Left → showImageLeft = true
                isTextFull={false}
                isImageFull={false}
                isFirst={false}
                isDescriptionFull={false}
                imageSize="xlarge"
              />
            </div>
          );
        })}

        {/* YouTube Section */}
        {productDetails?.youtubeVideos && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <Youtube youtubeVideo={productDetails.youtubeVideos} />
          </div>
        )}
      </div>
    </div>
  );
}
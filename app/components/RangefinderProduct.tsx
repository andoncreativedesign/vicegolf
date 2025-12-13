import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { VideoSection } from './Product/VideoSection';
import { Youtube } from './Youtube';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';

type RangefinderProductProps = {
  productDetails: ProductDetails | null;
};

export function RangefinderProduct({ productDetails }: RangefinderProductProps) {
  return (
    <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="max-w-8xl mx-auto">
        {productDetails?.videoContent && (
          <VideoSection videoContent={productDetails.videoContent} />
        )}

        {/* Product Content Sections */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isEven = (index + 1) % 2 === 0;
          const isFirst = index === 0;
          const isSecond = index === 1;

          // Alternate between image left/text right (odd) and text left/image right (even)
          const showImageLeft = index % 2 === 0;

          return (
            <div key={index} className={isFirst ? 'w-full' : ''}>
              <div className="w-full">
                <div className="flex items-center">
                  <div className="w-full py-8 mb-0">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={showImageLeft}
                      isTextFull={false}
                      isImageFull={false}
                      isFirst={isFirst}
                      isDescriptionFull={false}
                      imageSize="large"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Youtube Video Section */}
        {productDetails?.youtubeVideos && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <Youtube youtubeVideo={productDetails.youtubeVideos} />
          </div>
        )}
      </div>
    </div>
  );
}

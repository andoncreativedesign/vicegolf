import type { ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import ProductDetailsContent2 from './Product/ProductDetailsContent2';
import { Youtube } from './Youtube';
import { VideoSection } from './Product/VideoSection';
import { BestSellers } from './BestSellers';

type PuttersProductProps = {
  product: {
    id: string;
    productType?: string;
    tags?: string[];
    [key: string]: any;
  };
  productDetails: ProductDetails | null;
  initialRecommended?: any;
  showBestSellers?: boolean;
};

export function PuttersProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: PuttersProductProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
      {/* YouTube Section */}
      {productDetails?.youtubeVideos && <Youtube youtubeVideo={productDetails.youtubeVideos} />}

      {/* Video Section */}
      {productDetails?.videoContent && (
        <VideoSection
          videoContent={productDetails.videoContent}
          titleSize="text-4xl lg:text-5xl"
          descriptionSize="!text-xl font-light"
        />
      )}

      <div className="container mx-auto  max-w-7xl w-full">
        {productDetails?.productContent1?.content?.slice(0, 1).map((item, index) => (
          <div key={index} className="w-full">
            <div className="flex flex-col space-y-8 py-8">
              <ProductDetailsContent1
                content={item}
                showImageLeft={false}
                isTextFull={true}
                isImageFull={true}
                isDescriptionFull={true}
                imageSize="xlarge"
                titleClassName="text-4xl lg:text-5xl font-bold"
              />
            </div>
          </div>
        ))}

        {/* Product Content 2 */}
        {productDetails?.productContent2?.sections?.map((section, index: number) => (
          <div key={index} className="w-full">
            <ProductDetailsContent2 content={section} index={index} />
          </div>
        ))}
      </div>

      {showBestSellers &&
        initialRecommended?.products?.nodes?.length > 0 && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <BestSellers
              products={initialRecommended.products.nodes}
              title={null}
              sectionTitle="Explore our golf clubs"
            />
          </div>
        )}
    </div>
  );
}
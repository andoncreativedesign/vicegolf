import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import { Youtube } from './Youtube';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { VideoSection } from './Product/VideoSection';
import { BestSellers } from './BestSellers';


type GolfClubSetProductProps = {
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

export function GolfClubSetProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: GolfClubSetProductProps) {
  return (
    <div className='w-full max-w-[1536px] mx-auto'>
      {productDetails && productDetails?.youtubeVideos &&
        <Youtube youtubeVideo={productDetails?.youtubeVideos} />
      }

      <div className='px-8 py-4'>
        {productDetails && productDetails?.videoContent &&
          <VideoSection
            titleSize='lg:text-[48px] text-[32px] font-semibold'
            videoContent={productDetails?.videoContent}
          />
        }

        {/* Reusable What's New Section */}
        {productDetails?.productContent1?.content &&
          productDetails?.productContent1?.content.map((item, index) => (
            <ProductDetailsContent1
              key={index}
              content={item}
              showImageLeft={index % 2 === 0}
              titleClassName='lg:text-[48px] text-[32px] font-semibold w-full'
              imageSize='xlarge'
            />
          ))
        }
      </div>

      {showBestSellers &&
        initialRecommended?.products?.nodes?.length > 0 && (
          <div className="mt-16 md:mt-20 lg:mt-24 px-8">
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

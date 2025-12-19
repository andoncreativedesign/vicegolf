import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import { Youtube } from './Youtube';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { VideoSection } from './Product/VideoSection';


type GolfClubSetProductProps = {
  productDetails: ProductDetails | null;
};

export function GolfClubSetProduct({ productDetails }: GolfClubSetProductProps) {
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
            />
          ))
        }
      </div>
    </div>
  );
}

import type { ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type PuttersProductProps = {
  productDetails: ProductDetails | null;
};

export function PuttersProduct({ productDetails }: PuttersProductProps) {
  return (
    <div>
      <div className="max-w-8xl mx-auto">
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
      </div>
    </div>
  );
}